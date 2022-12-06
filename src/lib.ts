const RESERVED_PROPERTIES = new Set([
  '$on',
  '$off',
  '$once',
  '$emit',
  '$isReactive',
  '$listeners',
  '$parent',
  '$propName'
]);

export const r = (
  obj: any,
  parent: Object | undefined = undefined,
  propName: string | undefined = undefined
) => {
  // If the object is not an object, throw
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    throw new Error('The object passed to r() must be an object');
  }

  // If the object contains one of the reserved properties, throw
  if (Object.keys(obj).some((key) => RESERVED_PROPERTIES.has(key))) {
    throw new Error(
      `The
      object passed to r() cannot contain any of the following properties: ${Array.from(
        RESERVED_PROPERTIES
      ).join(', ')}`
    );
  }

  // If the object is already reactive, return it
  if (obj.$isReactive) {
    return obj;
  }

  // Create an r for every property of the object if an object itself
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      obj[key] = r(obj[key], obj, key);
    }
  });
  const reactiveObj = new Proxy(obj, {
    set: (target, prop, value) => {
      target[prop] = value;

      // If prop is a symbol or is a prop of the reactiveObject, return, nothing to do.
      if (typeof prop === 'symbol' || RESERVED_PROPERTIES.has(prop))
        return true;

      // If value is an object, create an r for it.
      if (typeof value === 'object') {
        value = r(value, target, prop);
      }

      // If prop is a method, emit the event.
      if (typeof value !== 'function') {
        reactiveObj.$emit(prop, value, target);
      }
      return true;
    }
  });

  reactiveObj.$isReactive = true;
  reactiveObj.$parent = parent;
  reactiveObj.$propName = propName;
  reactiveObj.$listeners = {};
  reactiveObj.$on = (prop, listener: Function) => {
    // If prop is a symbol or is a prop of the reactiveObject, return, throw
    if (RESERVED_PROPERTIES.has(prop))
      throw new Error(
        `Cannot listen to ${prop} as it is a reserved property and could potentially create an infinite loop.`
      );

    if (!reactiveObj.$listeners[prop]) {
      reactiveObj.$listeners[prop] = [];
    }
    reactiveObj.$listeners[prop].push(listener);
  };
  reactiveObj.$once = (prop: string, listener: Function) => {
    const onceListener = (...args) => {
      listener(...args);
      reactiveObj.$off(prop, onceListener);
    };
    reactiveObj.$on(prop, onceListener);
  };
  reactiveObj.$emit = (prop: string, value: unknown) => {
    if (reactiveObj.$listeners[prop]) {
      reactiveObj.$listeners[prop].forEach((listener: Function) =>
        listener(value)
      );
    }
    if (reactiveObj.$parent)
      reactiveObj.$parent.$emit(
        `${reactiveObj.$propName}.${prop}`,
        value,
        reactiveObj.$parent
      );
    if (!prop.includes('*')) {
      const propParts = prop.split('.');
      for (let i = propParts.length; i > 0; i--) {
        const wildcardProp = propParts.slice(0, i).join('.') + '.*';
        if (reactiveObj.$listeners[wildcardProp])
          reactiveObj.$emit(`${propParts.slice(0, i).join('.')}.*`, value);
      }
      if (reactiveObj.$listeners['*']) reactiveObj.$emit('*', value);
    }
  };
  reactiveObj.$off = (prop: string, listener: Function) => {
    if (reactiveObj.$listeners[prop]) {
      reactiveObj.$listeners[prop] = reactiveObj.$listeners[prop].filter(
        (l: Function) => l !== listener
      );
    }
  };

  // Prevent the RESERVED_PROPERTIES from being exposed
  Array.from(RESERVED_PROPERTIES).forEach((prop) => {
    Object.defineProperty(reactiveObj, prop, {
      enumerable: false,
      writable: true
    });
  });

  return reactiveObj;
};
