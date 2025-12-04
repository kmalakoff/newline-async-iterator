import { bufferFrom } from './compat.ts';

/**
 * Create an async iterator that yields chunks of a Uint8Array at specified split points.
 * This allows testing how the decoder handles multi-byte sequences split across chunks.
 *
 * @param bytes The complete byte array to split
 * @param splitPoints Array of byte indices where to split (e.g., [2, 5] splits into bytes 0-1, 2-4, 5-end)
 */
export default function chunkIterator(bytes: Uint8Array, splitPoints: number[]): AsyncIterableIterator<Uint8Array> {
  const sortedSplits = [...splitPoints].sort((a, b) => a - b);
  let chunkIndex = 0;

  const chunks: Uint8Array[] = [];
  let start = 0;
  for (const splitPoint of sortedSplits) {
    if (splitPoint > start && splitPoint <= bytes.length) {
      chunks.push(bytes.slice(start, splitPoint));
      start = splitPoint;
    }
  }
  if (start < bytes.length) {
    chunks.push(bytes.slice(start));
  }

  const iterator = {
    next(): Promise<IteratorResult<Uint8Array, undefined>> {
      if (chunkIndex >= chunks.length) {
        return Promise.resolve({ value: undefined, done: true });
      }
      const chunk = chunks[chunkIndex++];
      return Promise.resolve({ value: chunk, done: false });
    },
    [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array> {
      return this;
    },
  };

  return iterator;
}

/**
 * Encode a string to UTF-8 bytes
 */
export function encodeUTF8(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(s);
  }
  // Fallback for environments without TextEncoder - use compat bufferFrom
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(bufferFrom(s, 'utf8'));
  }
  throw new Error('No UTF-8 encoder available');
}
