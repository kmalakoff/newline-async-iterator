import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import Pinkie from 'pinkie-promise';
import stringIterator from '../lib/stringIterator.ts';

describe('exports .mjs', () => {
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
