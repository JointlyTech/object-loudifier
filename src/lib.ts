const RESERVED_PROPERTIES = new Set([
  '$on',
  '$off',
  '$once',
  '$emit',
  '$isLoud',
  '$listeners',
  '$parent',
  '$propName',
  '$preventBubbling'
]);

type Options = {
  allowNesting: boolean;
};

const defaultOptions = {
  allowNesting: false
};

type $onOptions = {
  preventBubbling: boolean;
  once: boolean;
};

const $onDefaultOptions = {
  preventBubbling: false,
  once: false
};

export const loudify = (
  obj: any,
  options: Partial<Options> = {},
  parent: Object | undefined = undefined,
  propName: string | undefined = undefined
) => {
  options = { ...defaultOptions, ...options };

  // If the object is not an object, throw
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    throw new Error('The object passed to loudify() must be an object');
  }

  // If the object contains one of the reserved properties, throw
  if (Object.keys(obj).some((key) => RESERVED_PROPERTIES.has(key))) {
    throw new Error(
      `The
      object passed to loudify() cannot contain any of the following properties: ${Array.from(
        RESERVED_PROPERTIES
      ).join(', ')}`
    );
  }

  // If the object is already loud, return it
  if (obj.$isLoud) {
    return obj;
  }

  // Create a loud object for every property of the object if an object itself
  if (options.allowNesting) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        obj[key] = loudify(obj[key], options, obj, key);
      }
    });
  }

  const loudObj = new Proxy(obj, {
    set: (target, prop, value) => {
      target[prop] = value;

      // If prop is a symbol or is a prop of the loudObj, return, nothing to do.
      if (typeof prop === 'symbol' || RESERVED_PROPERTIES.has(prop))
        return true;

      // If value is an object, create an r for it.
      if (typeof value === 'object') {
        value = loudify(value, options, target, prop);
      }

      // If value is not a function, emit the event.
      if (typeof value !== 'function') {
        loudObj.$emit(prop, value, target);
      }
      return true;
    }
  });

  loudObj.$isLoud = true;
  loudObj.$parent = parent;
  loudObj.$propName = propName;
  loudObj.$listeners = {};
  loudObj.$preventBubbling = false;

  loudObj.$on = (
    prop,
    listener: Function,
    options: Partial<$onOptions> = {}
  ) => {
    options = { ...$onDefaultOptions, ...options };
    const initialListener = listener;
    // If once is true, create a new listener that will remove itself after being called
    if (options.once) {
      const newListener = (...args) => {
        initialListener(...args);
        loudObj.$off(prop, newListener);
      };
      listener = newListener;
    }
    // If preventBubbling is true, create a new listener that will prevent the event from bubbling
    if (options.preventBubbling) {
      const newListener = (...args) => {
        initialListener(...args);
        loudObj.$preventBubbling = true;
      };
      listener = newListener;
    }

    // If prop is a symbol or is a prop of the loudObj, return, throw
    if (RESERVED_PROPERTIES.has(prop))
      throw new Error(
        `Cannot listen to ${prop} as it is a reserved property and could potentially create an infinite loop.`
      );

    if (!loudObj.$listeners[prop]) {
      loudObj.$listeners[prop] = [];
    }
    loudObj.$listeners[prop].push(listener);
  };
  loudObj.$once = (prop: string, listener: Function) => {
    loudObj.$on(prop, listener, { once: true });
  };
  loudObj.$emit = (prop: string, value: unknown) => {
    if (loudObj.$listeners[prop]) {
      loudObj.$listeners[prop].forEach((listener: Function) =>
        listener(value, prop)
      );
    }

    // If the event was prevented from bubbling, return
    if (loudObj.$preventBubbling) {
      loudObj.$preventBubbling = false;
      return;
    }

    if (loudObj.$parent)
      loudObj.$parent.$emit(`${loudObj.$propName}.${prop}`, value);
    if (!prop.includes('*')) {
      const propParts = prop.split('.');
      for (let i = propParts.length; i > 0; i--) {
        const wildcardProp = propParts.slice(0, i).join('.') + '.*';
        if (loudObj.$listeners[wildcardProp])
          loudObj.$emit(`${propParts.slice(0, i).join('.')}.*`, value);
      }
      if (loudObj.$listeners['*']) loudObj.$emit('*', value);
    }
  };
  loudObj.$off = (prop: string, listener: Function) => {
    if (loudObj.$listeners[prop]) {
      loudObj.$listeners[prop] = loudObj.$listeners[prop].filter(
        (l: Function) => l !== listener
      );
    }
  };

  // Prevent the RESERVED_PROPERTIES from being exposed
  Array.from(RESERVED_PROPERTIES).forEach((prop) => {
    Object.defineProperty(loudObj, prop, {
      enumerable: false,
      writable: true
    });
  });

  return loudObj;
};
