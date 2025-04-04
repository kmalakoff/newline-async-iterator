const hasBuffer = typeof Buffer !== 'undefined';

if (hasBuffer && !Buffer.from) {
  Buffer.from = function from(data, encoding) {
    return new Buffer(data, encoding);
  };
}

module.exports = function encodeUTF8(s) {
  return hasBuffer ? new Uint8Array(Buffer.from(s, 'utf8')) : Uint8Array.from(s, (x) => x.charCodeAt(0));
};
