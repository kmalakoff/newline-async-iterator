const Pinkie = require('pinkie-promise');
const stringIterator = require('../lib/stringIterator.cjs');

const assert = require('assert');

let umd = null;
try {
  umd = require('newline-async-iterator/umd');
} catch (_) {
  umd = require('newline-async-iterator/dist/umd/newline-async-iterator.cjs');
}
const newlineAsyncIterator = typeof window !== 'undefined' ? window.newlineAsyncIterator : umd.default || umd;

describe('exports umd', () => {
  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

  it('first newline', (done) => {
    const iterator = newlineAsyncIterator(stringIterator('some\r\nstring\ncombination\r'));
    iterator
      .next()
      .then((next) => {
        assert.deepEqual(next, { value: 'some', done: false });
        done();
      })
      .catch(done);
  });
});
