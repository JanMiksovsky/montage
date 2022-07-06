import LayoutSelector from "../src/LayoutSelector.js";
import assert from "./assert.js";

describe.skip("LayoutSelector", () => {
  it("best template for aspects", function () {
    const bounds = {
      height: 300,
      width: 400,
    };
    const aspects = [3 / 4, 3 / 4, 3 / 4, 3 / 4];
    // Use a deterministic scoring function to pick a template -- no randomness.
    const weights = {
      areaCovered: 1,
      smallestPhoto: 0,
      random: 0,
    };
    const padding = 0;
    const template = LayoutSelector.bestTemplateForAspects(
      bounds,
      aspects,
      padding,
      weights
    );
    // Best result will be a 2x2 grid.
    assert.deepEqual(template.toArray(), [
      [3 / 4, 3 / 4],
      [3 / 4, 3 / 4],
    ]);
  });
});
