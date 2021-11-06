import draw from "./draw.js";

const min = 4;
const max = 6;

export default async function drawHand(array) {
  const { debug } = await this.graph.get("constants");
  n = debug ? min : Math.floor(Math.random() * (max - min + 1)) + min;
  return draw(array, n);
}
