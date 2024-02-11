import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import '../lib/polyfill.cjs';
import stringIterator from '../lib/stringIterator.cjs';

describe('exports .ts', () => {
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
