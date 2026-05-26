/**
 * Create a new UTF-8 streaming decoder instance.
 * Each decoder maintains its own state for handling multi-byte
 * characters that span chunk boundaries.
 */
export default function createUTF8Decoder(): (uint8Array: Uint8Array) => string;
