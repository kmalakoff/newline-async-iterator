/* eslint-disable @typescript-eslint/no-var-requires */
require('./polyfill.cjs');
const hasBuffer = typeof Buffer !== 'undefined';

module.exports = function encodeUTF8(s) {
  return hasBuffer ? new Uint8Array(Buffer.from(s, 'utf8')) : Uint8Array.from(s, (x) => x.charCodeAt(0));
};
