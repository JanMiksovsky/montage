import AspectLayout from "./AspectLayout.js";

/**
 * A complete division of a rectangle into subrectangles. Rectangles which are
 * not subdivided are called "slots", and have a defined aspect ratio.
 *
 * A rectangulation is represented as a list of children. Each child can either
 * be a number (indicating an aspect ratio), or another AspectRectangulation
 * instance (indicating a sub-rectangulation).
 *
 * Some routines deal with padding, which is a measurement of how much each
 * rectangle in the rectangulation should be inset (padded). The padding applies
 * both horizontally and vertically. In either dimension, half the padding goes
 * above/to the left the rectangle, and half below/to the right. I.e., if a
 * rectangulation has padding of 20 units, then each rectangle ends up with 10
 * units on all edges.
 */
export default class AspectRectangulation {
  // The constructor takes an array representation of the rectangulation.
  constructor(
    array,
    orientation = AspectRectangulation.orientation.HORIZONTAL
  ) {
    this.orientation = orientation;
    /** @type {(AspectRectangulation|number)[]} */
    this.children = array.map((item) =>
      item instanceof Array
        ? new AspectRectangulation(
            item,
            AspectRectangulation.perpendicularOrientation(orientation)
          )
        : item
    );
  }

  /**
   * The overall aspect ratio of the rectangulation (with no padding). We define
   * aspect as the fraction of height / width (instead of the other way round),
   * per the example of Wikipedia: http://en.wikipedia.org/wiki/Aspect_ratio.
   */
  aspect() {
    const { aspect } = this.aspectFactors();
    return aspect;
  }

  /**
   * Return a pair of numbers representing the rectangulation's height expressed
   * in terms of width:
   *
   * aspect: the basic aspect ratio determining height from width
   * growth: the additional effect on the rectangulation's height of any padding.
   *
   * To get the final height including padding:
   * height = aspect * width + (1 - growth) * padding
   *
   * The aspect ratio is standard, but the growth factor is novel. A rectangle
   * with a fixed aspect ratio will change its height in response to a change in
   * width. If padding is applied to the rectangle, to preserve the aspect ratio
   * of the inner rectangle, the height of the outer rectangle will change as
   * well. The growth factor reflects the degree to which changing the padding
   * will change the height of the outer rectangle.
   *
   * A rectangle with an aspect ratio of 1 will have a growth factor of zero,
   * because increasing the padding will not change the height of the outer
   * rectangle. A rectangle with an aspect greater than 1 will have a negative
   * growth factor: applying a padding of p will decrease the height of the
   * outer rectangle by more than p. A rectangle with an aspect less than 1 will
   * have a positive growth factor: applying a padding of p will decrease the
   * height of the outer rectangle by less than p.
   */
  aspectFactors() {
    const childFactors = this.children.map((child) =>
      this.#childAspectFactors(child)
    );
    const combinator =
      this.orientation === AspectRectangulation.orientation.HORIZONTAL
        ? this.#combineAspectFactorsHorizontal
        : this.#combineAspectFactorsVertical;
    return childFactors.reduce(combinator);
  }

  /**
   * Calculate the { aspect, growth } factors for a child rectangulation.
   *
   * @param {AspectRectangulation|number} child
   */
  #childAspectFactors(child) {
    if (child instanceof AspectRectangulation) {
      return child.aspectFactors();
    } else {
      // Singleton
      const aspect = child;
      const growth = 1 - aspect;
      return { aspect, growth };
    }
  }

  /**
   * Combine the aspect factors for two rectangulations side by side.
   *
   * This case is more complex than the horizontal one. We have two
   * rectangulations with { aspect, growth } factors. Their heights can be
   * calculated from their widths:
   *
   * h1 = a1w1 + g1  ( height is aspect * width + growth )
   * h2 = a2w2 + g2
   *
   * We want to find the aspect and growth of the combination of these two
   * rectangulations. Their combined width will be
   *
   * w = w1 + w2
   *
   * When finished, their height will be equal, so we can solve for widths:
   *
   * h1 = h2                           Set heights equal
   * a1w1 + g1 = a2w2 + g2             Substitute from above
   * a1w1 + g1 = a2(w - w1) + g2       Substitute for w2
   * (a1 + a2)w1 = a2w + g2 - g1       Collect multiples of w1 on left side
   * w1 = (a2w + g2 - g1)/(a1 + a2)    Solve for w1
   *
   * Now we can get the height (of either, which is the height of both):
   *
   * h = a1w1 + g1                     From above
   *   = a1(a2w + g2 - g1)/(a1 + a2)   Use w1 we obtained above
   *   = ((a1a2)/(a1+a2))w + a1(g2 - g1)/(a1 + a2) + g1
   *
   * Which gives us a way to calculate the height of the combined rectangulation
   * in terms of width -- which is what the {aspect, growth} factors do. The
   * aspect is the term before the w (width), and the rest is the growth factor.
   *
   * So:
   *
   * a = (a1a2)/(a1+a2)
   * g = a1(g2 - g1)/(a1 + a2) + g1
   */
  #combineAspectFactorsHorizontal(factors1, factors2) {
    const { aspect: aspect1, growth: growth1 } = factors1;
    const { aspect: aspect2, growth: growth2 } = factors2;
    const aspect = (aspect1 * aspect2) / (aspect1 + aspect2);
    const growth =
      (aspect1 * (growth2 - growth1)) / (aspect1 + aspect2) + growth1;
    return { aspect, growth };
  }

  /**
   * Combine the aspect factors for two rectangulations stacked vertically.
   * This case is easy: we just sum both factors.
   */
  #combineAspectFactorsVertical(factors1, factors2) {
    const aspect = factors1.aspect + factors2.aspect;
    const growth = factors1.growth + factors2.growth;
    return { aspect, growth };
  }

  /**
   * Inflate the given rectangle in all directions by the given delta.
   */
  #inflateRectangle(rectangle, delta) {
    return {
      height: rectangle.height + 2 * delta,
      left: rectangle.left - delta,
      top: rectangle.top - delta,
      width: rectangle.width + 2 * delta,
    };
  }

  /**
   * Return the rectangle inscribing the rectangulation within the given bounds.
   */
  inscribe(bounds, padding) {
    const { aspect, growth } = this.aspectFactors();
    const inscribed = AspectRectangulation.inscribe(
      bounds,
      padding,
      aspect,
      growth
    );
    return { inscribed, aspect, growth };
  }

  /**
   * Return the rectangle inscribing a rectangulation that has the given aspect
   * and growth factors, and accommodating the desired padding. The rectangle
   * will fit within the given bounds.
   */
  static inscribe(bounds, padding, aspect, growth) {
    if (padding == null) {
      padding = 0;
    }
    // Assume we're horizontally constrained.
    const inscribed = {
      height: bounds.width * aspect + growth * padding,
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
    };
    if (inscribed.height > bounds.height) {
      // Too tall; actually vertically constrained.
      inscribed.height = bounds.height;
      inscribed.width = (bounds.height - growth * padding) / aspect;
    }
    return inscribed;
  }

  /**
   * Create a layout that applies the rectangulation to the given bounds. Return
   * a layout in absolute units. If interiorPaddingOnly is true, the padding
   * will only be applied to interior slot edges; the default is false, applying
   * padding to all slot edges.
   */
  layout(bounds, padding, interiorPaddingOnly) {
    if (interiorPaddingOnly) {
      bounds = this.#inflateRectangle(bounds, padding / 2);
    }
    if (padding == null) {
      padding = 0;
    }

    let { inscribed, aspect, growth } = this.inscribe(bounds, padding);
    // edge tracks the left or top edge of each child.
    let edge =
      this.orientation === AspectRectangulation.orientation.HORIZONTAL
        ? inscribed.left
        : inscribed.top;

    // Calculate the slot(s) produced by each child.
    const slotsForChildren = this.children.map((child) => {
      const { aspect, growth } = this.#childAspectFactors(child);
      let height, left, top, width;
      switch (this.orientation) {
        case AspectRectangulation.orientation.HORIZONTAL:
          // Vertically constrain
          height = inscribed.height;
          left = edge;
          width = (height - growth * padding) / aspect;
          top = inscribed.top;
          edge += width;
          break;
        case AspectRectangulation.orientation.VERTICAL:
          // Horizontally constrain
          left = inscribed.left;
          width = inscribed.width;
          height = width * aspect + growth * padding;
          top = edge;
          edge += height;
      }

      const slot = { height, left, top, width };

      if (child instanceof AspectRectangulation) {
        // Sub-rectanguluation: subdivide the slot.
        const subLayout = child.layout(slot, padding);
        return subLayout.slots;
      } else {
        // Actual slot: subtract out the desired padding.
        return [this.#inflateRectangle(slot, -padding / 2)];
      }
    });

    // Flatten to get the final list of slots.
    const slots = [].concat(...slotsForChildren);

    if (interiorPaddingOnly) {
      // Deflate the inscribed rectangle to get back within original bounds.
      inscribed = this.#inflateRectangle(inscribed, -padding / 2);
    }

    const layout = new AspectLayout(
      slots,
      aspect,
      growth,
      inscribed.height,
      inscribed.width,
      padding
    );

    // REVIEW: Why are we setting this?
    // @ts-ignore
    layout.rectangulation = this;

    return layout;
  }

  /**
   * Returns true if this rectangulation mirrors another w.r.t. the given axis.
   * The criteria for one slot mirroring another are not precise, they simply
   * need to be very close in size.
   *
   * @param {AspectRectangulation} rectangulation2
   */
  mirrors(rectangulation2, axis) {
    if (this.orientation !== rectangulation2.orientation) {
      return false;
    }
    const children1 = this.children;
    const children2 = rectangulation2.children;
    if (children1.length !== children2.length) {
      return false;
    }
    for (let index1 = 0; index1 < children1.length; index1++) {
      const child1 = children1[index1];
      const index2 =
        axis === this.orientation ? index1 : children2.length - index1 - 1; // Compare from same direction // Compare from opposite direction
      const child2 = children2[index2];
      let childrenMirror;
      if (child1 instanceof AspectRectangulation) {
        childrenMirror =
          child2 instanceof AspectRectangulation
            ? child1.mirrors(child2, axis)
            : false;
      } else if (child2 instanceof AspectRectangulation) {
        return false;
      } else {
        // Compare two individual aspect ratios to see if they're very close.
        // Here, that means the smaller of the two is larger than 99% the
        // magnitude of the larger one.
        const small = Math.min(child1, child2);
        const big = Math.max(child1, child2);
        childrenMirror = small / big >= 0.99;
      }
      if (!childrenMirror) {
        return false;
      }
    }

    // All children pass
    return true;
  }

  static orientation = {
    HORIZONTAL: 0,
    VERTICAL: 1,
  };

  static perpendicularOrientation(orientation) {
    return orientation === this.orientation.HORIZONTAL
      ? this.orientation.VERTICAL
      : this.orientation.HORIZONTAL;
  }

  /**
   * Return a new rectangulation in which this rectangulation's slots' aspect
   * ratios have been replaced with the indicated aspect ratios.
   */
  replaceAspects(aspects) {
    const replaced = this.#replaceAspects(this, aspects.slice(0));
    return new AspectRectangulation(replaced, this.orientation);
  }

  /**
   * Internal helper for replaceAspects(). This destructively consumes the
   * supplied aspect array. It returns an array representation of the new
   * rectangulation.
   */
  #replaceAspects(rectangulation, aspects) {
    const replaced = rectangulation.children.map((child) =>
      typeof child === "number"
        ? aspects.shift()
        : this.#replaceAspects(child, aspects)
    );
    return replaced;
  }

  /**
   * Returns true if rectangulation is symmetric across either axis.
   *
   * We want symmetry to be non-trivial. E.g., a rectangulation like [ 1, 2 ]
   * is, strictly speaking, symmetric vertically, but this is an uninteresting
   * form of symmetry, and will return false. A rectangluation like [ 1, 2, 1 ],
   * in comparison, has interesting horizontal symmetry, and returns true.
   *
   * Note: This checks to see whether the rectangulation mirrors itself, which
   * is twice as much work as actually needs to be done, since if the first half
   * of the rectangulation mirrors itself, so does the second.
   */
  symmetric() {
    let symmetricAlongOrientation = this.mirrors(this, this.orientation);
    if (
      symmetricAlongOrientation &&
      this.orientation === AspectRectangulation.orientation.HORIZONTAL
    ) {
      // Horizontal symmetry requires a sub-rectangulation to be interesting.
      const hasSubrectangulation = this.children.some(
        (child) => child instanceof AspectRectangulation
      );
      symmetricAlongOrientation = hasSubrectangulation;
    }
    return (
      symmetricAlongOrientation ||
      this.mirrors(
        this,
        AspectRectangulation.perpendicularOrientation(this.orientation)
      )
    );
  }

  /**
   * Return an array representation of the rectangulation.
   */
  toArray() {
    const items = this.children.map((child) => {
      if (typeof child === "number") {
        return child;
      } else {
        let childArray = child.toArray();
        if (child.orientation === AspectRectangulation.orientation.VERTICAL) {
          childArray = childArray[0];
        }
        return childArray;
      }
    });
    return this.orientation === AspectRectangulation.orientation.HORIZONTAL
      ? items
      : [items];
  }
}
