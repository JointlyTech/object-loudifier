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
const obj = loudify({ foo: { bar: 1 } });
obj.$on('foo.*', (newValue) => {
  console.log(newValue);
});
```

## Listener options

You can pass a third parameter to the `$on` method, which is an object with the following properties:
- `bubbling` - A boolean indicating if bubbling should be prevented. Default is `false`.
- `once` - A boolean indicating if the listener should be called only once. Default is `false`.

```js
obj.$on('foo.bar', (newValue) => {
  console.log(newValue);
}, { bubbling: false, once: true });
```

### Bubbling

By default, the `$on` method will bubble the changes to the parent object.  
For example, if you have the following object:

```js
const obj = loudify({ foo: { bar: 1 } });
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

The bubbling order for the change emission is the following:
1. The property listener (Considering a change in `obj.a.b.c`: `$obj.a.b.on('c')`)
2. The parent listener (Considering a change in `obj.a.b.c`: `$obj.on('a.b.c')`)
3. The wildcard listener (Considering a change in `obj.a.b.c`: `$obj.on('a.b.*`)`)

### Once

The `$once` method is a shortcut for the `$on` method with the `once` option set to `true`.


# ToDo

- [ ] Add tests to reach higher coverage.
- [ ] Improve type checking.
- [ ] Add infinite loop prevention.
- [ ] Analyze if needed - Add bubbling threshold (how many times a property can be changed before the event is not fired anymore) as a performance protection mechanism.
- [ ] Analyze how to export the changed key in a wildcard listener.