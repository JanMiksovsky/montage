import AspectRectangulation from "./AspectRectangulation.js";
import DateRangeFormatter from "./DateRangeFormatter.js";
import LayoutSelector from "./LayoutSelector.js";
// import screenAspect from "./screenAspect.js";
import selectionData from "./selectionData.js";

const minPhotosForCollage = 3;
const defaultAspect = 16 / 9;
const earliestSaneDate = new Date(1900, 0, 1);

export default async function collage(
  imagesGraph,
  desiredAspect = defaultAspect
) {
  const selection = await selectionData(imagesGraph);

  const imageRecords = selection.map((imageRecord) => {
    const { src, aspect } = imageRecord;
    return { src, aspect };
  });

  if (imageRecords.length < minPhotosForCollage) {
    // Not enough images to make a collage, or at least not enough with valid
    // image data.
    return null;
  }

  const aspects = imageRecords.map((imageRecord) => imageRecord.aspect);

  const date = formatDateRange(selection);

  // const boundsAspect = await screenAspect();
  const weights = {
    areaCovered: 0,
    smallestItem: 0.8,
    random: 0.2,
    symmetry: 0,
  };
  const rectangulation = LayoutSelector.bestRectangulation(
    desiredAspect,
    aspects,
    weights
  );
  const layout = rectangulation
    ? applyRectangulation(rectangulation, imageRecords)
    : null;

  // Gap is a random value between 1.0 and 3.0.
  const gap = 1 + Math.floor(Math.random() * 21) / 10;

  return Object.assign(
    {
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
  const filtered = dates.filter((date) => date && date >= earliestSaneDate);

  if (filtered.length === 0) {
    return null;
  } else if (filtered.length === 1) {
    return DateRangeFormatter.formatDate(filtered[0]);
  } else {
    const minDate = new Date(Math.min(...filtered));
    const maxDate = new Date(Math.max(...filtered));

    // Format that date range.
    return DateRangeFormatter.formatRange(minDate, maxDate);
  }
}
