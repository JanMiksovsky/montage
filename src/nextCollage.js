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

  // Assume we'll have images for collages. After each shuffle, we'll set this
  // to false, then set it true again only if we are able to successfully
  // generate a collage. If this flag is still false by the time we've exhausted
  // the folders, then none of the folders had sufficient images to make a
  // collage. In that case, we'll quit looping.
  let continueGenerating = true;

  while (continueGenerating) {
    continueGenerating = false;
    shuffle(folders);
    for (const folder of folders) {
      const hand = await draw(folder);
      const result = await collage(hand);
      if (result) {
        // HACK: Would like to avoid using file system paths
        if (root && folder.path) {
          result.base = path.relative(root, folder.path) + "/";

          // Use the last part of the path as the collage description.
          // We need a better way to get the name of the graph.
          const pathParts = folder.path.split("/");
          result.description = pathParts[pathParts.length - 1];
        }
        continueGenerating = true;
        yield result;
      }
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
