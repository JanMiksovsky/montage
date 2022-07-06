import exif from "./exif.js";

// Given an image buffer, return just the metadata needed by the collage.
export default async function imageData(buffer) {
  const exifData = await exif(buffer);
  const { imageSize, tags } = exifData;
  const { height, width } = imageSize;

  const { Orientation: orientation } = tags;
  const aspect =
    orientation !== undefined && orientation > 4
      ? // Rotated; report aspect of corrected orientation.
        height / width
      : width / height;

  // The exif-parser *appears* to return EXIF dates as a Unix timestamp.
  // Multiple by 1000 to get milliseconds since the epoch.
  const exifDateTime = tags.DateTime ?? tags.DateTimeOriginal;
  let date;
  if (exifDateTime) {
    const utcDate = new Date(exifDateTime * 1000);
    // There doesn't appear to be time zone information in EXIF data.
    // Guess that the time is in the local time zone and convert from UTC.
    // Not sure what the cleanest way to do that is, but here we convert
    // to ISO 8601 format, remove the "Z", and then back to a Date object.
    const isoDate = utcDate.toISOString().replace("Z", "");
    date = new Date(isoDate);
  }

  return {
    aspect,
    date,
  };
}
