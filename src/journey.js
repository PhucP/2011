// A selected photo begins a circular journey: every photo is shown once before video.
export function photoOrder(start, count) {
  if (!Number.isInteger(count) || count < 1 || !Number.isInteger(start) || start < 0 || start >= count) throw new RangeError('Invalid photo selection');
  return Array.from({ length: count }, (_, i) => (start + i) % count);
}
export const chapters = { intro: 0, revealing: 0, classroom: 1, flying: 2, letter: 2, opening: 2, gallery: 3, memory: 4, artboard: 4, video: 5, closing: 5 };
