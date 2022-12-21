# What is it?

This is a library allowing to create reactive objects.
Given an object, it will return a new object with the same properties but with the ability to react to changes in the original object.

# How do I install it?

You can install it by using the following command:

```bash
npm install @jointly/object-loudifier
```

# Tests

You can run the tests by using the following command:

```bash
npm test
```

# How does it work?

Just wrap the object in the `loudify` function.  
The function expects just a single parameter, the object you want to make reactive.  
You can then watch for changes in the object by using the `$on` method.  
The function expects three parameters:
- The name of the property you want to watch
- A callback function.  
- An `options` parameter for additional configuration. It is explained later in the document as `Listener options`.  

The callback function will be called every time the property changes.  
The callback function will be called with the new value of the property as its first parameter.  
You can also watch for changes for nested properties by using the dot notation and the wildcards (Explained in the `Wildcards` section).

# Other Info

## Wildcards

You can use wildcards to watch for changes in multiple properties.  
For example, if you want to watch for changes in the `foo` and `bar` properties, you can use the following code:

```js
const obj = loudify({ foo: 1, bar: 2 });
obj.$on('*', (newValue) => {
  console.log(newValue);
});
```

You can also use wildcards for nested properties.

```js
const obj = loudify({ foo: { bar: 1 } }, { allowNesting: true });
obj.$on('foo.*', (newValue) => {
  console.log(newValue);
});
```

## Listener options

You can pass a third parameter to the `$on` method, which is an object with the following properties:
- `preventBubbling` - A boolean indicating if bubbling should be prevented. Default is `false`.
- `once` - A boolean indicating if the listener should be called only once. Default is `false`.

```js
obj.$on('foo.bar', (newValue) => {
  console.log(newValue);
}, { preventBubbling: false, once: true });
```

### Bubbling

By default, the `$on` method will bubble the changes to the parent object.  
For example, if you have the following object:

```js
const obj = loudify({ foo: { bar: 1 } }, { allowNesting: true });
```

And you watch for changes in the `foo.bar` property and in the `foo` property, you will get notified in both cases.

```js
obj.$on('foo.bar', (newValue) => {
  console.log(newValue);
});

obj.$on('foo', (newValue) => {
  console.log(newValue);
});
```

#### Bubbling priority

The event emission order is the following:
1. The property listeners are called.
2. The parent listeners are called.
3. The wildcard listeners are called using the following sub-order:
    1. The property listeners are called.
    2. The parent listeners are called.

Considering the following example:
  
  ```js
  const obj = loudify({ foo: { bar: 1 } }, { allowNesting: true });
  obj.foo.$on('bar', (newValue) => {
    console.log('foo->bar');
  });
  obj.$on('*', (newValue) => {
    console.log('*');
  });
  obj.$on('foo.*', (newValue) => {
    console.log('foo.*');
  });
  obj.$on('foo.bar', (newValue) => {
    console.log('foo.bar');
  });
  ```

The following output will be printed:

```bash
foo->bar
foo.bar
foo.*
*
```

### Once

The `$once` method is a shortcut for the `$on` method with the `once` option set to `true`.

# Benchmarks

You can run the benchmarks by using the following command:

```bash
npm run benchmark
```

Tested on a MacBook Pro M1 Max (Retina, 16-inch, 2021) with 32GB of RAM.  
The results are in milliseconds.  
The results are the average of 100000 runs.  

| Benchmark | Without loudify | With loudify | Notes |
| --- | --- | --- | --- |
| 1 | 1.73 | 55.72 | Simple object assignment |
| 2 | 1.38 | 144.11 | Object nested assignment |
| 3 | 1.51 | 155.05 | Object nested assignment with wildcard |
| 4 | 1.57 | 244.63 | Object nested assignment with wildcard and multiple listeners |
| 5 | 1.54 | 721.68 | Object assignment with multiple nested properties |

Even if the benchmarks show a big difference with a native object, yet the library is capable of easily handling tens of thousands of changes per second.  

In a real-case scenario, reaching milions of changes per second is possible (As in Benchmark #1).