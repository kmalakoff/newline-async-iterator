const Pinkie = require('pinkie-promise');
const assert = require('assert');
const newlineIterator = require('newline-async-iterator/dist/umd/newline-async-iterator.cjs');
const stringIterator = require('../lib/stringIterator.cjs');

describe('exports newline-async-iterator/dist/umd/newline-async-iterator.cjs', () => {
  (() => {
    // patch and restore promise
    const root = typeof global !== 'undefined' ? global : window;
    let rootPromise;
    before(() => {
      rootPromise = root.Promise;
      // @ts-ignore
      root.Promise = Pinkie;
    });
    after(() => {
      root.Promise = rootPromise;
    });
  })();

  it('first newline', (done) => {
    const iterator = newlineIterator(stringIterator('some\r\nstring\ncombination\r'));
    iterator
      .next()
      .then((next) => {
        assert.deepEqual(next, { value: 'some', done: false });
        done();
      })
      .catch(done);
  });
});
