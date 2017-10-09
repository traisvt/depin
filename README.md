<p align="center">
  <h3 align="center">depin 📦</h3>
  <p align="center">A simple dependency injection container.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/depin">
      <img src="https://img.shields.io/npm/v/depin.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/depin">
      <img src="https://travis-ci.org/Moeriki/depin.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/depin?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/depin/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <a href="https://snyk.io/test/github/moeriki/depin">
      <img src="https://snyk.io/test/github/moeriki/depin/badge.svg" alt="Known Vulnerabilities"></img>
    </a>
  </p>
</p>

---

## Install

```sh
npm install --save depin
```

## Quick start

```js
const depin = require('depin');

const app = depin();

app.set('beatles', [
  { name: 'George' },
  { name: 'John' },
  { name: 'Paul' },
  { name: 'Ringo' },
]);

app.register('beatleService' (beatles) => ({
  getCount() {
    return beatles.length;
  },
}));

app.get('beatleService').count(); // 4
```

## API


#### `apply( factory:function ) :*`

Run a function with all arguments injected from the DI container by name and return the result.

```js
app.set({ one: 1, two: 2, three: 3 });
app.apply((one, two, three) => one + two + three); // 6
```

#### `get( [name:string] ) :*`

Get a value from the DI container.

```js
app.set({ one: 1 });
app.get('one'); // value
```

When no name is passed `app.get` will return a dependency picker which is very useful when combined with object destructuring.

```js
app.set({ one: 1, two: 2 });
const { one, two } = app.get();
```

#### `register( factory:function ) :app`

Register a factory.

```js
app.set({ one: 1, two: 2 });
app.register(function myManager(one, two) {
  return { add: () => one + two };
});
app.get('myManager').add(); // 3
```

Or set its name directly.

```js
app.set({ one: 1, two: 2 });
app.register('myManager', (one, two) => {
  return { add: () => one + two };
});
app.get('myManager').add(); // 3
```

#### `run( func:function ) :app`

Run a function with all arguments injected from the DI container by name.

```js
app.set({ one: 1, two: 2 });
app.run((one, two) => {
  //
});
```

#### `set( properties:object ) :app` / `set( name:string, value:* ):app`

Set values in the DI container.
