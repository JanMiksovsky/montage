import AspectRectangulation from "./AspectRectangulation.js";
import DateRangeFormatter from "./DateRangeFormatter.js";
import LayoutSelector from "./LayoutSelector.js";
import screenAspect from "./screenAspect.js";
import selectionData from "./selectionData.js";

export default async function collage(imagesGraph) {
  // Use the last part of the selection path as the collage description.
  // const pathParts = selectionPath.split("/");
  // const description = pathParts[pathParts.length - 1];

  const selection = await selectionData(imagesGraph);

  const imageRecords = selection.map((imageRecord) => {
    const { src, aspect } = imageRecord;
    return { src, aspect };
  });
  const aspects = imageRecords.map((imageRecord) => imageRecord.aspect);

  const date = formatDateRange(selection);

  // const template = new AspectRectangulation([
  //   [1, 1],
  //   [1, 1],
  // ]);
  // const template = new AspectRectangulation([[1, 1], 1]);
  // const template = LayoutSelector.randomTemplateForAspects(aspects);
  const boundsAspect = await screenAspect();
  const weights = {
    areaCovered: 0,
    smallestItem: 0.8,
    random: 0.2,
    symmetry: 0,
    // areaCovered: 0,
    // smallestItem: 1,
    // random: 0,
    // symmetry: 0,
  };
  const rectangulation = LayoutSelector.bestRectangulation(
    boundsAspect,
    aspects,
    weights
  );
  const layout = applyRectangulation(rectangulation, imageRecords);

  // Gap is a random value between 1.0 and 3.0.
  const gap = 1 + Math.floor(Math.random() * 21) / 10;

  return Object.assign(
    {
      // description,
      date,
      gap,
    },
    layout
  );
}

function applyRectangulation(rectangulation, records) {
  const aspect = rectangulation.aspect;
  const items = rectangulation.children.map((child) =>
    child instanceof AspectRectangulation
      ? applyRectangulation(child, records)
      : records.shift()
  );
  return {
    aspect,
    items,
  };
}

function formatDateRange(imageRecords) {
  // Get the minimum and maximum dates.
  const dates = imageRecords.map(({ date }) => date);
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
  const aspects = photos.map((photo) => 1 / photo.aspect);
  // Use a deterministic scoring function to pick a template -- no randomness.
  // const weights = {
  //   areaCovered: 1,
  //   smallestItem: 0,
  //   random: 0,
  // };
  // Use a set of balanced weights to score possible layouts.
  const weights = {
    areaCovered: 0.05,
    smallestItem: 0.4,
    random: 0.45,
    symmetry: 0.1,
  };
  const padding = 0;
  const template = LayoutSelector.bestRectangulation(
    bounds,
    aspects,
    padding,
    weights
  );
  return template;
}
