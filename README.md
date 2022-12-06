# What is it?

This is a library allowing to create reactive objects.
Given an object, it will return a new object with the same properties but with the ability to react to changes in the original object.

# How does it work?

Just wrap the object in the `r` function.  
The function expects just a single parameter, the object you want to make reactive.  
You can then watch for changes in the object by using the `$on` method.  
The function expects two parameters, the name of the property you want to watch and a callback function.  
The callback function will be called every time the property changes.  
The callback function will be called with the new value of the property as its first parameter.  
You can also watch for changes in the whole object by using the `$on` method and providing an empty string as the first argument.

# Other Info

You can use wildcards to watch for changes in multiple properties.  
For example, if you want to watch for changes in the `foo` and `bar` properties, you can use the following code:

```js
const obj = r({ foo: 1, bar: 2 });
obj.$on('*', (newValue) => {
  console.log(newValue);
});
```

You can also use wildcards for nested properties.

```js
const obj = r({ foo: { bar: 1 } });
obj.$on('foo.*', (newValue) => {
  console.log(newValue);
});
```

# ToDo

- [ ] Refactor: Every 'reactive' name must become 'loud'
- [x] Test
- [x] $on con chiave vuota --> Sostituita con $on('\*');
- [x] wildcard sul $on (Es. `$on('test.\*', () => {})`)
- [x] Prevent exposing private properties
- [x] Test performance --> Less than 25ms for 10000 mutations
