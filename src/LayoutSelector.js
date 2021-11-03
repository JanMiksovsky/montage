import AspectRectangulation from "./AspectRectangulation.js";
import templates from "./templates.js";

/**
 * Chooses layouts for a set of objects with aspect ratios.
 *
 * Layouts are chosen from templates, which are generated through code. A template
 * is an array defining the structure of a rectangulation. By convention, a
 * template uses a number 1 for all aspect ratios in the rectangulation. E.g.:
 *
 * The template [1, 1] indicates a horizontal arrangement of two rectangles.
 * The template [1, [1, 1]] indicates a horizontal arrangement of one rectangle
 * on the left, and a vertical stack of two rectangles on the right.
 *
 * When selecting a layout, a template's placeholder aspect ratios will be replaced
 * with the actual aspect ratios of the objects being laid out.
 *
 */
export default class LayoutSelector {
  /**
   * Return a number between 0 and 1 representing the fraction of the given
   * bounds which will be covered by the layout. (1 = completely covered)
   */
  static #areaCoveredFactor(layout, bounds) {
    const layoutArea = layout.width * layout.height;
    const boundsArea = bounds.width * bounds.height;
    return layoutArea / boundsArea;
  }

  /**
   * Pick the "best" template for the given set of aspect ratios. Use the
   * supplied weights to score the possible layouts. Weights should sum to 1.
   */
  static bestTemplateForAspects(bounds, aspects, padding = 0, weights) {
    const slotCount = aspects.length;
    const possibleTemplates = templates[slotCount];
    const rectangulations = possibleTemplates.map((template) => {
      const templateRectangulation = new AspectRectangulation(template);
      return templateRectangulation.replaceAspects(aspects);
    });
    const layouts = rectangulations.map((rectangulation) =>
      rectangulation.layout(bounds, padding, true)
    );
    // Pick the layout with the best score.
    const scores = layouts.map((layout) =>
      this.#layoutScore(layout, bounds, weights)
    );
    const bestTemplateIndex = this.#largestItemIndex(scores);
    return rectangulations[bestTemplateIndex];
  }

  /**
   * Return the index of the largest item.
   */
  static #largestItemIndex(items) {
    const maxItem = Math.max.apply(Math, items);
    return items.indexOf(maxItem);
  }

  /**
   * Return a score for the given layout, applying the given weights.
   */
  static #layoutScore(layout, bounds, weights) {
    const scores = {
      areaCovered: this.#areaCoveredFactor(layout, bounds),
      smallestPhoto: this.#smallestPhotoFactor(layout, bounds),
      symmetry: this.#symmetryFactor(layout),
      random: Math.random(),
    };
    const totalScore =
      weights.areaCovered * scores.areaCovered +
      weights.smallestPhoto * scores.smallestPhoto +
      weights.random * scores.random;
    return totalScore;
  }

  static selectLayoutForAspects(bounds, aspects, padding) {
    const rectangulation = this.selectTemplateForAspects(
      bounds,
      aspects,
      padding
    );
    return rectangulation.layout(bounds, padding, true);
  }

  static selectLayoutForPhotos(bounds, photos, padding) {
    const photoAspects = photos.map((photo) => photo.aspect());
    return this.selectLayoutForAspects(bounds, photoAspects, padding);
  }

  // @randomLayoutForAspects: ( bounds, aspects, padding ) ->
  //   rectangulation = @randomTemplateForAspects aspects
  //   rectangulation.layout bounds, padding

  // @randomTemplateForAspects: ( aspects ) ->
  //   slotCount = aspects.length
  //   possibleTemplates = @templates[ slotCount ]
  //   index = Math.floor Math.random() * possibleTemplates.length
  //   template = possibleTemplates[ index ]
  //   rectangulation = new AspectRectangulation template
  //   rectangulation.replaceAspects aspects

  /**
   * Use a set of balanced weights to score possible layouts.
   */
  static selectTemplateForAspects(bounds, aspects, padding) {
    const weights = {
      areaCovered: 0.05,
      smallestPhoto: 0.4,
      random: 0.45,
      symmetry: 0.1,
    };
    return this.bestTemplateForAspects(bounds, aspects, padding, weights);
  }

  /**
   * Return a number between 0 and 1 representing the fraction of the given
   * bounds which will be covered by the smallest photo in the layout. This is
   * expressed as a portion of the available area divided by the number of slots.
   * E.g., if the layout has six slots, a value of 1 indicates that the smallest
   * photo consumes 1/6 of the available area — i.e., the maximum size for the
   * smallest photo.
   */
  static #smallestPhotoFactor(layout, bounds) {
    const photoAreas = layout.slots.map((slot) => slot.width * slot.height);
    const smallestPhotoIndex = this.#smallestItemIndex(photoAreas);
    const smallestPhotoArea = photoAreas[smallestPhotoIndex];
    const boundsArea = bounds.width * bounds.height;
    const maxSmallestPhotoArea = boundsArea / layout.slots.length;
    return smallestPhotoArea / maxSmallestPhotoArea;
  }

  /**
   * Return the index of the smallest item.
   */
  static #smallestItemIndex(items) {
    const smallestItem = Math.min.apply(Math, items);
    return items.indexOf(smallestItem);
  }

  /**
   * Return 1 if the layout is symmetric, 0 if assymetric.
   */
  static #symmetryFactor(layout) {
    return layout.rectangulation?.symmetric() ? 1 : 0;
  }
}
