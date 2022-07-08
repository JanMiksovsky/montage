import LayoutSelector from "../src/LayoutSelector.js";
import assert from "./assert.js";

describe("LayoutSelector", () => {
  it("best rectangulation for aspects", function () {
    const boundsAspect = 4 / 3;
    const aspects = [4 / 3, 4 / 3, 4 / 3, 4 / 3];
    // Use a deterministic scoring function to pick a template -- no randomness.
    const weights = {
      areaCovered: 1,
      random: 0,
      smallestPhoto: 0,
      symmetry: 0,
    };
    const rectangulation = LayoutSelector.bestRectangulation(
      boundsAspect,
      aspects,
      weights
    );
    // Best result will be a 2x2 grid.
    assert.deepEqual(rectangulation.toArray(), [
      [4 / 3, 4 / 3],
      [4 / 3, 4 / 3],
    ]);
  });
});
