## newline-async-iterator

Line-by-line async iterator for the browser and node

```sh
npm install newline-async-iterator
```

### Parse lines from byte chunks

```js
import newlineIterator from "newline-async-iterator";

async function* chunks() {
  yield new TextEncoder().encode("some\r\nstring\ncombination");
}

const lines = [];
for await (const line of newlineIterator(chunks()))
  lines.push(line);
console.log(lines); // ["some", "string", "combination"]
```

### Documentation

[API Docs](https://kmalakoff.github.io/newline-async-iterator/)
