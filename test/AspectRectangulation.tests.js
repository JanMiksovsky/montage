import AspectRectangulation from "../src/AspectRectangulation.js";
import assert from "./assert.js";

const example1 = [1];
const example1by2 = [1, 1];
const example2by1 = [[1, 1]];
const example2and3 = [2, 3];
const example211 = [[2, 1], 1];
const exampleComplex = [1, [1, [1, 1]]];

// AspectRectangulation unit tests.
describe("AspectRectangulation", () => {
  it("create from array", () => {
    const rectangulation = new AspectRectangulation(exampleComplex);
    assert.equal(
      rectangulation.orientation,
      AspectRectangulation.orientation.HORIZONTAL
    );
    // Consider top node's children.
    assert.equal(rectangulation.children.length, 2);
    const [leftChild, rightChild] = rectangulation.children;
    assert.equal(leftChild, 1);
    assert(rightChild instanceof AspectRectangulation);
    assert.equal(
      // @ts-ignore
      rightChild.orientation,
      AspectRectangulation.orientation.VERTICAL
    );
    // Consider right child's children.
    // @ts-ignore
    assert.equal(rightChild.children.length, 2);
    // @ts-ignore
    const [rightLeftChild, rightRightChild] = rightChild.children;
    assert.equal(rightLeftChild, 1);
    assert(rightRightChild instanceof AspectRectangulation);
    assert.equal(
      rightRightChild.orientation,
      AspectRectangulation.orientation.HORIZONTAL
    );
    // Consdier right child's child's children.
    assert.deepEqual(rightRightChild.children, [1, 1]);
  });

  it("aspect ratio horizontal", () => {
    const rectangulation = new AspectRectangulation(example1by2);
    assert.equal(rectangulation.aspect(), 2);
  });

  it("aspect ratio vertical", () => {
    const rectangulation = new AspectRectangulation(example2by1);
    assert.equal(rectangulation.aspect(), 0.5);
  });

  it("aspect ratio complex", () => {
    const rectangulation = new AspectRectangulation(exampleComplex);
    assert.approximately(rectangulation.aspect(), 5 / 3, 0.00001);
  });

  it("to array", () => {
    const rectangulation = new AspectRectangulation(exampleComplex);
    assert.deepEqual(rectangulation.toArray(), exampleComplex);
  });

  it.skip("replace aspects", () => {
    const original = new AspectRectangulation(exampleComplex);
    const aspects = [4 / 3, 3 / 4, 4 / 3, 4 / 3];
    const replaced = original.replaceAspects(aspects);
    assert.deepEqual(replaced.toArray(), [4 / 3, [3 / 4, [4 / 3, 4 / 3]]]);
  });

  it.skip("aspect with padding, 1x1", () => {
    const rectangulation = new AspectRectangulation(example1);
    const aspect = rectangulation.aspectFactors();
    assert.deepEqual(aspect, {
      aspect: 1,
      growth: 0,
    });
  });

  it.skip("aspect with padding, 1x2", () => {
    const rectangulation = new AspectRectangulation(example1by2);
    const aspect = rectangulation.aspectFactors();
    assert.deepEqual(aspect, {
      aspect: 0.5,
      growth: 0,
    });
  });

  it.skip("aspect with padding, 2x1", () => {
    const rectangulation = new AspectRectangulation(example2by1);
    const aspect = rectangulation.aspectFactors();
    assert.deepEqual(aspect, {
      aspect: 2,
      growth: 0,
    });
  });

  it.skip("aspect with padding, 2 and 3", () => {
    const rectangulation = new AspectRectangulation(example2and3);
    const aspect = rectangulation.aspectFactors();
    assert.deepEqual(aspect, {
      aspect: 6 / 5,
      growth: -1.4,
    });
  });

  it.skip("layout 1x2 (no padding)", () => {
    const bounds = {
      height: 100,
      left: 0,
      width: 100,
      top: 0,
    };
    const rectangulation = new AspectRectangulation(example1by2);
    const layout = rectangulation.layout(bounds);
    assert.equal(layout.aspect, 0.5);
    assert.deepEqual(layout.slots, [
      {
        height: 50,
        left: 0,
        width: 50,
        top: 0,
      },
      {
        height: 50,
        left: 50,
        width: 50,
        top: 0,
      },
    ]);
  });

  it.skip("layout 1x2 (with padding)", () => {
    const bounds = {
      height: 100,
      left: 0,
      width: 100,
      top: 0,
    };
    const padding = 20;
    const rectangulation = new AspectRectangulation(example1by2);
    const layout = rectangulation.layout(bounds, padding);
    assert.equal(layout.aspect, 0.5);
    assert.equal(layout.growth, 0);
    assert.deepEqual(layout.slots, [
      {
        height: 30,
        left: 10,
        width: 30,
        top: 10,
      },
      {
        height: 30,
        left: 60,
        width: 30,
        top: 10,
      },
    ]);
  });

  it.skip("layout 1x2 (interior padding only)", () => {
    const bounds = {
      height: 100,
      left: 0,
      width: 100,
      top: 0,
    };
    const padding = 20;
    const rectangulation = new AspectRectangulation(example1by2);
    const layout = rectangulation.layout(bounds, padding, true);
    assert.equal(layout.aspect, 0.5);
    assert.equal(layout.growth, 0);
    assert.deepEqual(layout.slots, [
      {
        height: 40,
        left: 0,
        width: 40,
        top: 0,
      },
      {
        height: 40,
        left: 60,
        width: 40,
        top: 0,
      },
    ]);
  });

  it.skip("layout 2 and 3 (with padding)", () => {
    const bounds = {
      height: 90,
      left: 0,
      width: 90,
      top: 0,
    };
    const padding = 20;
    const rectangulation = new AspectRectangulation(example2and3);
    const layout = rectangulation.layout(bounds, padding);
    assert.equal(layout.aspect, 6 / 5);
    assert.equal(layout.growth, -1.4);
    assert.deepEqual(layout.slots, [
      {
        height: 60,
        left: 10,
        width: 30,
        top: 10,
      },
      {
        height: 60,
        left: 60,
        width: 20,
        top: 10,
      },
    ]);
  });

  it.skip("layout [[2, 1], 1]", () => {
    const bounds = {
      height: 460,
      left: 0,
      width: 460,
      top: 0,
    };
    const padding = 20;
    const rectangulation = new AspectRectangulation(example211);
    const layout = rectangulation.layout(bounds, padding);
    assert.equal(layout.aspect, 3 / 4);
    assert.equal(layout.growth, -1 / 4);
    assert.deepEqual(layout.slots, [
      {
        height: 200,
        left: 10,
        width: 100,
        top: 10,
      },
      {
        height: 100,
        left: 10,
        width: 100,
        top: 230,
      },
      {
        height: 320,
        left: 130,
        width: 320,
        top: 10,
      },
    ]);
  });

  it("symmetric", () => {
    assert(symmetric([1]));
    assert(symmetric([1, 1])); // Horizontally interesting
    assert(!symmetric([1, 2])); // Simple vertical symmetry is uninteresting
    assert(symmetric([1, 2, 1]));
    assert(!symmetric([1, [1, 2]]));
    assert(!symmetric([1, 2, 1, 1]));
    assert(
      !symmetric([
        [1, 2],
        [2, 1],
      ])
    );
    assert(symmetric([[1]]));
    assert(symmetric([[1, 2]]));
    assert(symmetric([[1.33333, 1.337979]])); // Close enough
    assert(symmetric([[1, 2, 1]]));
    assert(symmetric([1, [1, 1]]));
    assert(!symmetric([1, [1, 2]]));
    assert(
      symmetric([
        [1, 2],
        [1, 2],
      ])
    );
    assert(
      symmetric([
        [1, [1, 2]],
        [1, [2, 1]],
      ])
    );
    assert(
      symmetric([
        [
          [1, 2],
          [1, 2],
        ],
      ])
    );
  });
});

function symmetric(template) {
  const rectangulation = new AspectRectangulation(template);
  return rectangulation.symmetric();
}
