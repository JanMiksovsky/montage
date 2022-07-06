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
   * The overall aspect ratio of the rectangulation. We define aspect as the
   * ratio of width / height to match the CSS aspect-ratio property
   * (https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio).
   */
  aspect() {
    const childAspects = this.children.map((child) =>
      child instanceof AspectRectangulation
        ? child.aspect()
        : // Singleton
          child
    );
    const combinator =
      this.orientation === AspectRectangulation.orientation.HORIZONTAL
        ? this.#combineAspectsHorizontal
        : this.#combineAspectsVertical;
    return childAspects.reduce(combinator);
  }

  /**
   * Combine the aspect ratios for two rectangulations side by side.
   */
  #combineAspectsHorizontal(aspect1, aspect2) {
    // This case is easy: we just sum both factors.
    return aspect1 + aspect2;
  }

  /**
   * Combine the aspect ratios for two rectangulations stacked vertically.
   */
  #combineAspectsVertical(aspect1, aspect2) {
    return (aspect1 * aspect2) / (aspect1 + aspect2);
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
      child instanceof AspectRectangulation
        ? this.#replaceAspects(child, aspects)
        : aspects.shift()
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
