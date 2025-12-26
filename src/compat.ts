// Feature detection - no global modifications per polyfill-removal plans

/**
 * Convert a Uint8Array to a number array
 * Compatible with Node 0.8+ (no Array.from)
 */
export function uint8ArrayToArray(uint8Array: Uint8Array): number[] {
  if (typeof Array.from === 'function') return Array.from(uint8Array);

  // Fallback for old environments without Array.from
  const arr: number[] = [];
  for (let i = 0; i < uint8Array.length; i++) {
    arr.push(uint8Array[i]);
  }
  return arr;
}
