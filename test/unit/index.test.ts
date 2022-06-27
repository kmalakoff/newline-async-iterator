import '../lib/polyfill.cjs';
import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import stringIterator from '../lib/stringIterator.cjs';

const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;

describe('newline-async-iterator', function () {
  describe('next', function () {
    it('all values', function (done) {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(stringIterator(string));

      iterator
        .next()
        .then(function (next) {
          assert.deepEqual(next, { value: 'some', done: false });
          iterator
            .next()
            .then(function (next) {
              assert.deepEqual(next, { value: 'string', done: false });
              iterator
                .next()
                .then(function (next) {
                  assert.deepEqual(next, { value: 'combination', done: false });
                  iterator
                    .next()
                    .then(function (next) {
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

    it('no breaks', function (done) {
      const string = 'somestringcombination';
      const iterator = newlineIterator(stringIterator(string));
      iterator
        .next()
        .then(function (next) {
          assert.deepEqual(next, { value: 'somestringcombination', done: false });
          iterator
            .next()
            .then(function (next) {
              assert.deepEqual(next, { value: undefined, done: true });
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  !hasAsync ||
    describe('iterator', function () {
      it('all values', async function () {
        const string = 'some\r\nstring\ncombination\r';
        const iterator = newlineIterator(stringIterator(string));

        const results = [];
        for await (const line of iterator) results.push(line);
        assert.deepEqual(results, ['some', 'string', 'combination']);
      });

      it('no breaks', async function () {
        const string = 'somestringcombination';
        const iterator = newlineIterator(stringIterator(string));
        const results = [];
        for await (const line of iterator) results.push(line);
        assert.deepEqual(results, ['somestringcombination']);
      });
    });
});
