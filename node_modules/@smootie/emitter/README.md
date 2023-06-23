# KiwiEmitter
- Faster, Lightweight, Type-Safe and Small advanced emitter.

# Update News

- fixed some typing bugs.

## Installation
- We are recommend to use [`pnpm`](https://npmjs.com/pnpm).
```bash
pnpm i @smootie/emitter
```

## Usage
- Similar to `node:events`.
```js
//esm and ts
import KiwiEmitter from "@smootie/emitter";
/*
 * on commonjs
 * const KiwiEmitter = require("@smootie/emitter").default 
*/
const emitter = new KiwiEmitter();

emitter.on("event", (e) => console.log(e)); // welcome kiwi!

emitter.emit("event", "welcome kiwi!");
```
- We are supported Event typing with [TypeScript](https://www.typescriptlang.org/).
```ts
import KiwiEmitter from "@smootie/emitter";


interface AnyEvents{
   event: (e: string) => any;
};
const emitter = new KiwiEmitter<AnyEvents>();

emitter.on("event", (e) => console.log(e)); // welcome kiwi!

emitter.emit("event", "welcome kiwi!");
```

## Authors
- [@erqeweew](https://github.com/erqeweew) (Developer)
- [@davutozgursukuti4531](https://github.com/davutozgursukuti4531) (Developer, Contributor)
