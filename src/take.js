// Given a graph, take the first n items from it.
export default function take(graph, n) {
  return {
    async *[Symbol.asyncIterator]() {
      const iterator = graph[Symbol.asyncIterator]();
      for (let i = 0; i < n; i++) {
        const item = await iterator.next();
        if (item.done) {
          break;
        }
        yield item.value;
      }
    },

    async get(key) {
      return graph.get(key);
    },
  };
}
