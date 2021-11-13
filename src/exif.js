import exifParser from "exif-parser";

// TODO: Feels weird to have this function deal with the name of the file.
export default async function exif(buffer, sourceKey) {
  const parser = exifParser.create(buffer);
  parser.enableTagNames(true);
  parser.enableSimpleValues(true);
  const result = await parser.parse();
  // Convert an exif-parser result to a plain object.
  const plain = Object.assign(
    {
      name: sourceKey,
    },
    result
  );
  return plain;
}
