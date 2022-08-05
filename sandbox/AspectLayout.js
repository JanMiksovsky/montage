/*
An arrangement of slots within a bounding rectangle.

Slots are positioned with top, left, height, and width coordinates. The overall
layout has an aspect ratio and accompanying padding growth factor. The initial
padding and dimensions of the layout are defined as well.
*/
export default class AspectLayout {
  constructor(slots, aspect, growth, height1, width1, padding) {
    this.slots = slots;
    this.aspect = aspect;
    this.growth = growth;
    this.height = height1;
    this.width = width1;
    this.padding = padding;
  }

  heightForWidth(width) {
    return this.aspect * width + this.growth * this.padding;
  }

  widthForHeight(height) {
    return (height - this.growth * this.padding) / this.aspect;
  }
}
