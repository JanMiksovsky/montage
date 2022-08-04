import { ExplorableGraph, map } from "@explorablegraph/explorable";
import imageData from "./imageData.js";

// Given a graph representing a selection of images, return an array of image
// records containing an image's name, date, and aspect ratio.
export default async function selectionData(selectionGraph) {
  const graph = map(selectionGraph, async (buffer, key) => {
    const src = escape(key);
    const data = await imageData(buffer);
    if (!data) {
      return null;
    }
    return Object.assign({ src }, data);
  });
  const values = await ExplorableGraph.values(graph);
  const filtered = values.filter((value) => value !== null);
  return filtered;
}
