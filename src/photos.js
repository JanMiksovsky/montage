import { defaultGraph, ExplorableGraph } from "@explorablegraph/explorable";

/**
 * Given a graph, filter it to return .JPG/.JPEG files only.
 */
export default function photos(variant = defaultGraph()) {
  const graph = ExplorableGraph.from(variant);
  return {
    async *[Symbol.asyncIterator]() {
      for await (const key of graph) {
        const lower = key.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
          yield key;
        } else {
          const value = await graph.get(key);
          if (ExplorableGraph.isExplorable(value)) {
            yield key;
          }
        }
      }
    },

    async get(key, ...rest) {
      let value = await graph.get(key);
      if (ExplorableGraph.isExplorable(value)) {
        value = photos(value);
        if (rest.length > 0) {
          value = await value.get(...rest);
        }
      }
      return value;
    },
  };
}
