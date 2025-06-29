import assert from 'assert';
// @ts-ignore
import newlineIterator from 'newline-async-iterator';
import Pinkie from 'pinkie-promise';
import stringIterator from '../lib/stringIterator.ts';

const hasAsyncIterable = typeof Symbol !== 'undefined' && Symbol.asyncIterator !== undefined;

describe('newline-async-iterator', () => {
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

  describe('next', () => {
    it('all values', (done) => {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(stringIterator(string));

      iterator
        .next()
        .then((next) => {
          assert.deepEqual(next, { value: 'some', done: false });
          iterator
            .next()
            .then((next) => {
              assert.deepEqual(next, { value: 'string', done: false });
              iterator
                .next()
                .then((next) => {
                  assert.deepEqual(next, { value: 'combination', done: false });
                  iterator
                    .next()
                    .then((next) => {
                      assert.deepEqual(next, { value: null, done: true });
                      done();
                    })
                    .catch(done);
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('no breaks', (done) => {
      const string = 'somestringcombination';
      const iterator = newlineIterator(stringIterator(string));
      iterator
        .next()
        .then((next) => {
          assert.deepEqual(next, {
            value: 'somestringcombination',
            done: false,
          });
          iterator
            .next()
            .then((next) => {
              assert.deepEqual(next, { value: null, done: true });
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe('iterator', () => {
    if (!hasAsyncIterable) return;

    it('all values', async () => {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(stringIterator(string));

      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['some', 'string', 'combination']);
    });

    it('no breaks', async () => {
      const string = 'somestringcombination';
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['somestringcombination']);
    });
  });
});
