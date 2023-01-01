import { ExplorableGraph } from "@graphorigami/origami";

// Return a random, arbitrarily-deep path from the graph.
export default async function randomPath(graph) {
  const keys = await ExplorableGraph.keys(graph);
  const explorableKeyPromises = keys.map((key) =>
    ExplorableGraph.isKeyExplorable(graph, key)
  );
  const explorableKeyResults = await Promise.all(explorableKeyPromises);
  const explorableKeys = keys
    .map((key, index) => (explorableKeyResults[index] ? key : null))
    .filter((key) => key !== null);
  let count = explorableKeys.length;
  // The graph itself is included as an option.
  count++;

  const index = Math.floor(Math.random() * count);
  if (index === 0) {
    // Use this graph.
    return "";
  }

  const key = explorableKeys[index - 1];
  console.log(index, key, JSON.stringify(explorableKeys));
  const subgraph = await graph.get(key);
  const restOfPath = ExplorableGraph.isExplorable(subgraph)
    ? await randomPath(subgraph)
    : "";
  const path = restOfPath === "" ? key : [key, restOfPath].join("/");
  return path;
}
