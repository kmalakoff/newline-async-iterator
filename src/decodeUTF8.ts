import { uint8ArrayToArray } from './compat.ts';

/**
 * Get the expected length of a UTF-8 sequence from its first byte
 */
function getUTF8SequenceLength(byte: number): number {
  if (byte < 0x80) return 1; // 0xxxxxxx - ASCII
  if (byte < 0xc0) return 0; // 10xxxxxx - continuation byte (invalid as start)
  if (byte < 0xe0) return 2; // 110xxxxx
  if (byte < 0xf0) return 3; // 1110xxxx
  if (byte < 0xf8) return 4; // 11110xxx
  return 0; // Invalid UTF-8 start byte
}

/**
 * Decode a single UTF-8 code point from bytes
 */
function decodeCodePoint(bytes: number[], start: number, length: number): string {
  let codePoint: number;

  switch (length) {
    case 1:
      codePoint = bytes[start];
      break;
    case 2:
      codePoint = ((bytes[start] & 0x1f) << 6) | (bytes[start + 1] & 0x3f);
      break;
    case 3:
      codePoint = ((bytes[start] & 0x0f) << 12) | ((bytes[start + 1] & 0x3f) << 6) | (bytes[start + 2] & 0x3f);
      break;
    case 4:
      codePoint = ((bytes[start] & 0x07) << 18) | ((bytes[start + 1] & 0x3f) << 12) | ((bytes[start + 2] & 0x3f) << 6) | (bytes[start + 3] & 0x3f);
      break;
    default:
      return '\ufffd'; // Replacement character for invalid sequences
  }

  // Handle code points outside BMP (need surrogate pairs in JavaScript)
  if (codePoint > 0xffff) {
    // Convert to surrogate pair
    codePoint -= 0x10000;
    return String.fromCharCode(0xd800 + (codePoint >> 10), 0xdc00 + (codePoint & 0x3ff));
  }

  return String.fromCharCode(codePoint);
}

/**
 * Create a fallback UTF-8 streaming decoder with its own state
 */
function createFallbackDecoder(): (uint8Array: Uint8Array) => string {
  let pendingBytes: number[] = [];

  return function decode(uint8Array: Uint8Array): string {
    // Combine pending bytes with new input
    const inputBytes = uint8ArrayToArray(uint8Array);
    const bytes = pendingBytes.length > 0 ? pendingBytes.concat(inputBytes) : inputBytes;
    pendingBytes = [];

    let result = '';
    let i = 0;

    while (i < bytes.length) {
      const byte = bytes[i];
      const sequenceLength = getUTF8SequenceLength(byte);

      if (sequenceLength === 0) {
        // Invalid start byte or continuation byte - emit replacement character
        result += '\ufffd';
        i++;
        continue;
      }

      if (i + sequenceLength > bytes.length) {
        // Incomplete sequence - save for next chunk
        pendingBytes = bytes.slice(i);
        break;
      }

      result += decodeCodePoint(bytes, i, sequenceLength);
      i += sequenceLength;
    }

    return result;
  };
}

/**
 * Create a TextDecoder-based streaming decoder
 */
function createTextDecoderDecoder(): (uint8Array: Uint8Array) => string {
  const decoder = new TextDecoder('utf8');
  return function decode(uint8Array: Uint8Array): string {
    return decoder.decode(uint8Array, { stream: true });
  };
}

/**
 * Create a new UTF-8 streaming decoder instance.
 * Each decoder maintains its own state for handling multi-byte
 * characters that span chunk boundaries.
 */
export default function createUTF8Decoder(): (uint8Array: Uint8Array) => string {
  if (typeof TextDecoder !== 'undefined') {
    return createTextDecoderDecoder();
  }
  return createFallbackDecoder();
}
