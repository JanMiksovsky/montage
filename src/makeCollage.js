import { values } from "@explorablegraph/explorable";

export default async function makeCollage(graph) {
  const result = await values(graph);
  return result;
}
