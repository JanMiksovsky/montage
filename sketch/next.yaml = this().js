// Generates an infinite series of collages.
export default async function* gen() {
  while (true) {
    const collages = await this.graph.get("collages");
    for await (const key of collages) {
      const collage = await collages.get(key);
      if (collage) {
        yield collage;
      }
    }
  }
}
