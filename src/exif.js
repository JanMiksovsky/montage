import exifParser from "exif-parser";

// Given a buffer containing image data, return the EXIF metadata.
export default async function exif(buffer) {
  const parser = exifParser.create(buffer);
  parser.enableTagNames(true);
  parser.enableSimpleValues(true);
  const parsed = await parser.parse();
  // Convert an exif-parser result to a plain object.
  const plain = Object.assign({}, parsed);
  return plain;
}
