// Generates an infinite series of collages.
export default async function* gen() {
  while (true) {
    const collages = await this.graph.get("collages");
    const traversal = ExplorableGraph.traverse(collages);
    for await (const key of traversal) {
      const collage = await traversal.get(key);
      if (collage) {
        yield collage;
      }
    }
  }
}
