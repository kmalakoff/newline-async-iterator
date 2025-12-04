// Feature detection - no global modifications per polyfill-removal plans
const hasBuffer = typeof Buffer !== 'undefined';
const hasBufferFrom = hasBuffer && typeof Buffer.from === 'function' && Buffer.from !== Uint8Array.from;

export function bufferFrom(data: string, encoding?: BufferEncoding): Buffer {
  if (hasBufferFrom) {
    return Buffer.from(data, encoding);
  }
  // Node 0.8-4.x compatibility: use Buffer constructor
  return new Buffer(data, encoding);
}
