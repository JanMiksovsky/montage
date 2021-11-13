import exif from "./exif.js";

export default async (buffer) => ({
  "image.jpeg": buffer,
  "exif.yaml": await exif(buffer),
});
