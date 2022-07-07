import path from "path";
import { fileURLToPath } from "url";
import collage from "./collage.js";
import draw from "./draw.js";
import leafFolders from "./leafFolders.js";

// HACK: Would like to avoid using file system paths
const root = path.dirname(fileURLToPath(import.meta.url));

const generators = new Map();

export default async function nextCollage(graph) {
  let generator = generators.get(graph);
  if (!generator) {
    generator = collageGenerator(graph);
    generators.set(graph, generator);
  }
  const next = await generator.next();
  return next?.value;
}

async function* collageGenerator(graph) {
  const folders = await leafFolders(graph);
  while (true) {
    shuffle(folders);
    for (const folder of folders) {
      const hand = await draw(folder);
      const result = await collage(hand);
      // HACK: Would like to avoid using file system paths
      if (root && folder.path) {
        const base = path.relative(root, folder.path) + "/";
        result.base = base;
      }
      yield result;
    }
  }
}

/*
 * Shuffle an array.
 *
 * Performs a Fisher-Yates shuffle. From http://sedition.com/perl/javascript-fy.html
 */
function shuffle(array) {
  var i = array.length;
  while (--i >= 0) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
