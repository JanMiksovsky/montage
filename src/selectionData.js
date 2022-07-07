import { ExplorableGraph, map } from "@explorablegraph/explorable";
import imageData from "./imageData.js";

// Given a graph representing a selection of images, return an array of image
// records containing an image's name, date, and aspect ratio.
export default async function selectionData(selectionGraph) {
  const graph = map(selectionGraph, async (buffer, key) => {
    const src = key;
    return Object.assign({ src }, await imageData(buffer));
  });
  return ExplorableGraph.values(graph);
}
