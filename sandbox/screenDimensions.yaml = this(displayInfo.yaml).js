import { ExplorableGraph } from "@explorablegraph/explorable";

export default async function screenDimensions(displayInfo) {
  const info = await ExplorableGraph.plain(ExplorableGraph.from(displayInfo));
  const resolution = findKey(info, "Resolution");
  if (!resolution) {
    return null;
  }
  const regex = /(?<width>\d+)\s*x\s*(?<height>\d+)/;
  const match = regex.exec(resolution);
  if (!match) {
    return null;
  }
  const { height, width } = match.groups;
  return {
    height: parseInt(height),
    width: parseInt(width),
  };
}

function findKey(obj, key) {
  if (obj[key]) {
    return obj[key];
  }
  for (const k in obj) {
    if (typeof obj[k] === "object") {
      const result = findKey(obj[k], key);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
