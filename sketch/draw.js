export default function draw(array, n = 1) {
  if (array.length < n) {
    // Not enough values.
    return null;
  }

  // Take the first n values from the array.
  const values = array.slice(0, n);

  // Remove those first n values from the array.
  array.splice(0, n);

  return values;
}
