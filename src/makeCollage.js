import DateRangeFormatter from "./DateRangeFormatter.js";
import LayoutSelector from "./LayoutSelector.js";

export default async function makeCollage(graph) {
  return {
    async *[Symbol.asyncIterator]() {
      let hasPhotosYaml = false;
      for await (const key of graph) {
        if (key === "photos.yaml") {
          hasPhotosYaml = true;
        }
        yield key;
      }
      if (hasPhotosYaml) {
        yield "collage.yaml";
      }
    },

    async get(key, ...rest) {
      if (rest.length > 0 || key !== "collage.yaml") {
        return await graph.get(key, ...rest);
      } else {
        // Return collage.yaml
        const photos = await graph.get("photos.yaml");
        return await collage(photos);
      }
    },
  };
}

async function collage(photos) {
  if (photos.length < 4) {
    return undefined;
  }

  let dateRange = formatDateRange(photos);
  const template = pickTemplate(photos);
  const array = template.toArray();
  const aspect = template.aspect();

  return {
    array,
    aspect,
    dateRange,
    photos,
  };
}

function formatDateRange(photos) {
  // Get the minimum and maximum dates.
  const dates = photos.map(({ date }) => date);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Format that date range.
  return DateRangeFormatter.format(minDate, maxDate);
}

function pickTemplate(photos) {
  const bounds = {
    height: 300,
    width: 400,
  };
  const aspects = photos.map((photo) => photo.aspect);
  // Use a deterministic scoring function to pick a template -- no randomness.
  const weights = {
    areaCovered: 1,
    smallestPhoto: 0,
    random: 0,
  };
  const padding = 0;
  const template = LayoutSelector.bestTemplateForAspects(
    bounds,
    aspects,
    padding,
    weights
  );
  return template;
}
