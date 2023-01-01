import { ExplorableGraph } from "@graphorigami/origami";

/**
 * Return an array of paths to the values in the graph.
 */
export default async function paths(graph, prefix = "") {
  const result = [];
  if (ExplorableGraph.isExplorable(graph)) {
    for await (const key of graph) {
      const isKeyExplorable = await ExplorableGraph.isKeyExplorable(graph, key);
      if (isKeyExplorable) {
        const path = prefix ? `${prefix}/${key}` : key;
        const value = await graph.get(key);
        const subPaths = await paths(value, path);
        if (subPaths.length > 0) {
          result.push(...subPaths);
        } else {
          result.push(path);
        }
      }
    }
  }
  return result;
}
