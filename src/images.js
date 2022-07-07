import path from "path";

// From https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const imageExtensions = {
  apng: true,
  avif: true,
  gif: true,
  jfif: true,
  jpeg: true,
  jpg: true,
  pjp: true,
  pjpeg: true,
  png: true,
  svg: true,
  webp: true,
};

// Return just the images in the graph.
export default function images(graph) {
  return {
    async *[Symbol.asyncIterator]() {
      for await (const key of graph) {
        let extname = path.extname(key).toLowerCase();
        // Remove the leading dot from the extension.
        extname = extname.slice(1);
        const isImage = imageExtensions[extname];
        if (isImage) {
          yield key;
        }
      }
    },

    async get(key) {
      return graph.get(key);
    },
  };
}
