var hasBuffer = typeof Buffer !== 'undefined';

if (hasBuffer && !Buffer.from) {
  Buffer.from = function from(data, encoding) {
    return new Buffer(data, encoding);
  };
}

module.exports = function encodeUTF8(s) {
  if (hasBuffer) {
    return new Uint8Array(Buffer.from(s, 'utf8'));
  }
  // Fallback for environments without Buffer
  var arr = [];
  for (var i = 0; i < s.length; i++) {
    arr.push(s.charCodeAt(i));
  }
  return Uint8Array.from ? Uint8Array.from(arr) : new Uint8Array(arr);
};
