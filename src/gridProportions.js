import { ExplorableGraph } from "@graphorigami/origami";

export default async function gridProportions(items, rowsOrColumns) {
  const plain = await ExplorableGraph.plain(items);
  const factors = plain.map((item) =>
    rowsOrColumns === "columns" ? item.aspect : 1 / item.aspect
  );
  const total = factors.reduce((total, factor) => total + factor, 0);
  const proportions = factors.map(
    (factor) => `${Math.round((1000000 * factor) / total) / 10000}%`
  );
  return proportions.join(" ");
}
