export default async function (graph) {
  return {
    async *[Symbol.asyncIterator]() {
      // If the base graph has any photos, then yield a single photos.yaml key.
      for await (const key of graph) {
        yield "photos.yaml";
        break;
      }
    },

    async get(key, ...rest) {
      if (rest.length > 0) {
        return await graph.get(key, ...rest);
      }
      if (key === "photos.yaml") {
        return await getPhotos(graph);
      }
      return undefined;
    },
  };
}

async function getPhotos(graph) {
  const result = [];
  for await (const key of graph) {
    const photoData = await graph.get(key);
    result.push(photoData);
  }
  return result;
}
