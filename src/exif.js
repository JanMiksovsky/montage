import exifParser from "exif-parser";

export default async function exif(buffer) {
  const parser = exifParser.create(buffer);
  parser.enableTagNames(true);
  parser.enableSimpleValues(true);
  const result = await parser.parse();
  // Convert an exif-parser result to a plain object.
  const plain = Object.assign({}, result);
  return plain;
}
