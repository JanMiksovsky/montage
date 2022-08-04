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
   * Return the "best" rectangulation for the given set of image aspect ratios.
   * Use the supplied weights to score the possible layouts. Weights should sum
   * to 1.
   *
   * If no images are supplied, return null.
   */
  static bestRectangulation(boundsAspect, imageAspects, weights) {
    const imageCount = imageAspects.length;
    if (imageCount === 0) {
      return null;
    }

    const possibleTemplates = templates[imageCount];
    const rectangulations = possibleTemplates.map((template) => {
      const templateRectangulation = new AspectRectangulation(template);
      return templateRectangulation.replaceAspects(imageAspects);
    });

    const scores = rectangulations.map((rectangulation) =>
      this.#layoutScore(rectangulation, boundsAspect, weights)
    );

    // Pick the rectangulation with the best score.
    let maxScore = 0;
    let bestRectangulationIndex = 0;
    for (let index = 0; index < scores.length; index++) {
      const score = scores[index];
      if (score > maxScore) {
        maxScore = score;
        bestRectangulationIndex = index;
      }
    }

    return rectangulations[bestRectangulationIndex];
  }

  /**
   * Return a score for the given rectangulation, applying the given weights.
   */
  static #layoutScore(rectangulation, boundsAspect, weights) {
    const scores = {
      areaCovered: rectangulation.areaCovered(boundsAspect),
      random: Math.random(),
      smallestItem: rectangulation.areaCoveredBySmallestItem(boundsAspect),
      symmetry: rectangulation.symmetric ? 1 : 0,
    };
    const totalScore =
      weights.areaCovered * scores.areaCovered +
      weights.random * scores.random +
      weights.smallestItem * scores.smallestItem +
      weights.symmetry * scores.symmetry;
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

  static randomTemplateForAspects(aspects) {
    const slotCount = aspects.length;
    const possibleTemplates = templates[slotCount];
    const index = Math.floor(Math.random() * possibleTemplates.length);
    const template = possibleTemplates[index];
    const rectangulation = new AspectRectangulation(template);
    return rectangulation.replaceAspects(aspects);
  }

  /**
   * Use a set of balanced weights to score possible layouts.
   */
  static selectTemplateForAspects(bounds, aspects, padding) {
    const weights = {
      areaCovered: 0.05,
      smallestItem: 0.4,
      random: 0.45,
      symmetry: 0.1,
    };
    return this.bestRectangulation(bounds, aspects, padding, weights);
  }
}
