import AspectRectangulation from "../src/AspectRectangulation.js";
import assert from "./assert.js";

const example1by2 = [1, 1];
const example2by1 = [[1, 1]];
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
    assert.equal(rectangulation.aspect, 2);
  });

  it("aspect ratio vertical", () => {
    const rectangulation = new AspectRectangulation(example2by1);
    assert.equal(rectangulation.aspect, 0.5);
  });

  it("aspect ratio complex", () => {
    const rectangulation = new AspectRectangulation(exampleComplex);
    assert.approximately(rectangulation.aspect, 5 / 3, 0.00001);
  });

  it("to array", () => {
    const rectangulation = new AspectRectangulation(exampleComplex);
    assert.deepEqual(rectangulation.toArray(), exampleComplex);
  });

  it("area covered by rectangulation", () => {
    const fixture = new AspectRectangulation(example1by2);
    assert.equal(fixture.areaCovered(1), 0.5);
    assert.equal(fixture.areaCovered(2), 1);
    assert.equal(fixture.areaCovered(4), 0.5);
  });

  it("replace aspects", () => {
    const original = new AspectRectangulation(exampleComplex);
    const aspects = [4 / 3, 3 / 4, 4 / 3, 4 / 3];
    const replaced = original.replaceAspects(aspects);
    assert.deepEqual(replaced.toArray(), [4 / 3, [3 / 4, [4 / 3, 4 / 3]]]);
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
  return rectangulation.symmetric;
}
