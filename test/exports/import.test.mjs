import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import Pinkie from 'pinkie-promise';
import stringIterator from '../lib/stringIterator.ts';

describe('exports .mjs', () => {
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
