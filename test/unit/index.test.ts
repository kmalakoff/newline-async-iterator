import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import '../lib/polyfill.cjs';
import stringIterator from '../lib/stringIterator.cjs';

const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;

describe('newline-async-iterator', () => {
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
                      assert.deepEqual(next, { value: undefined, done: true });
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
              assert.deepEqual(next, { value: undefined, done: true });
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  !hasAsync ||
    describe('iterator', () => {
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
