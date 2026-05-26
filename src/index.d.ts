/**
 * Create a newline iterator recognizing CR, LF, and CRLF using the Symbol.asyncIterator interface
 *
 * @param source The async iterable of Uint8Array chunks to iterate through
 *
 * ```typescript
 * import newlineIterator from "newline-async-iterator";
 *
 * const iterator = newlineIterator(readableStream);
 * const results = [];
 * for await (const line of iterator) results.push(line);
 * console.log(results); // ["some", "string", "combination"];
 * ```
 */
export default function newlineIterator(source: AsyncIterable<Uint8Array> | AsyncIterator<Uint8Array>): AsyncIterableIterator<string>;
