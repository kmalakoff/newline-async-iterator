## newline-async-iterator

Line-by-line async iterator for the browser and node

### Example 1: Parse json line by line

```typescript
import newlineIterator from "newline-async-iterator";
import "isomorphic-fetch";
import responseIterator from "response-iterator";

const res = await fetch("https://raw.githubusercontent.com/kmalakoff/newline-async-iterator/master/package.json");

const lines = [];
for await (const line of newlineIterator(responseIterator<Uint8Array>(res))) lines.push(line);
console.log(JSON.parse(lines.join("\r\n")).name); // "newline-async-iterator"
```

### Documentation

[API Docs](https://kmalakoff.github.io/newline-async-iterator/)
