/* eslint-disable @typescript-eslint/no-var-requires */

function polyfill() {
  if (typeof Promise === 'undefined') {
    /* eslint-disable-next-line no-undef */
    const root = typeof window === 'undefined' ? global : window;
    root.Promise = require('pinkie-promise');
  }

  if (typeof Buffer !== 'undefined' && !Buffer.from) {
    Buffer.from = function from(data, encoding) {
      return new Buffer(data, encoding);
    };
  }
}
polyfill();
