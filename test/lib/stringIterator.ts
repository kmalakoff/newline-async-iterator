import { bufferFrom } from './compat.ts';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/**
 * Encode a string to UTF-8 bytes
 */
function encodeToUTF8(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(s);
  }
  // Fallback for environments without TextEncoder (old Node)
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(bufferFrom(s, 'utf8'));
  }
  throw new Error('No UTF-8 encoder available');
}

/**
 * Create an async iterator that yields one byte at a time from a UTF-8 encoded string.
 * This tests the decoder's ability to handle multi-byte UTF-8 sequences split at every byte.
 */
export default function stringIterator(string: string) {
  const bytes = encodeToUTF8(string);
  let offset = 0;

  const iterator = {
    next() {
      if (offset >= bytes.length) return Promise.resolve({ value: undefined, done: true });
      // Return one byte at a time as a Uint8Array
      const byte = bytes[offset++];
      return Promise.resolve({ value: new Uint8Array([byte]), done: false });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  return iterator;
}
