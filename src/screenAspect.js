import { ExplorableGraph, shell } from "@explorablegraph/explorable";

export default async function screenAspect() {
  // Default aspect ratio is 16:9.
  let aspect = 16 / 9;
  const displayInfo = await shell("system_profiler SPDisplaysDataType");
  if (displayInfo) {
    const info = await ExplorableGraph.plain(ExplorableGraph.from(displayInfo));
    const resolution = findKey(info, "Resolution");
    if (resolution) {
      const regex = /(?<width>\d+)\s*x\s*(?<height>\d+)/;
      const match = regex.exec(resolution);
      if (match) {
        const { height, width } = match.groups;
        aspect = width / height;
      }
    }
  }
  return aspect;
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
