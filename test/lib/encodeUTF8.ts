const hasBuffer = typeof Buffer !== 'undefined';

if (hasBuffer && !Buffer.from) {
  // @ts-ignore
  Buffer.from = function from(data, encoding) {
    return new Buffer(data, encoding);
  };
}

export default function encodeUTF8(s) {
  return hasBuffer ? new Uint8Array(Buffer.from(s, 'utf8')) : Uint8Array.from(s, (x: string) => x.charCodeAt(0));
}
