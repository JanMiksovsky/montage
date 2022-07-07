import { shuffle } from "@explorablegraph/explorable";
import images from "./images.js";
import take from "./take.js";

// Pick a random set of 4–6 images from the graph.
export default async function draw(graph) {
  const shuffled = await shuffle(images(graph));
  // Pick a number between 4 and 6.
  const count = 4 + Math.floor(Math.random() * 3);
  return take(shuffled, count);
}
