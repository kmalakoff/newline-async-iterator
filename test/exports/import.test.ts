import assert from 'assert';
// @ts-ignore
import newlineIterator from 'newline-async-iterator';
// @ts-ignore
import stringIterator from '../lib/stringIterator.ts';

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
