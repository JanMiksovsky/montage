import { ExplorableGraph } from "@graphorigami/origami";

/**
 * Return an array of the folders next to the edge of the graph.
 */
export default async function leafFolders(graph) {
  const result = [];
  if (ExplorableGraph.isExplorable(graph)) {
    for await (const key of graph) {
      const isKeyExplorable = await ExplorableGraph.isKeyExplorable(graph, key);
      if (isKeyExplorable) {
        const value = await graph.get(key);
        const subfolders = await leafFolders(value);
        if (subfolders.length > 0) {
          result.push(...subfolders);
        } else {
          result.push(value);
        }
      }
    }
  }
  return result;
}
