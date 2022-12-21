import { defaultOptions, $onDefaultOptions } from './defaults';
import {
  emittedMetadata,
  ListenerFn,
  Options,
  $onOptions,
  LoudObject
} from './models';

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

export const loudify = (
  obj: any,
  options: Partial<Options> = {},
  parent: Object | undefined = undefined,
  propName: string | undefined = undefined
): LoudObject<typeof obj> => {
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
    applyLoudifyToNestedProperties();
  }

  const loudObj = new Proxy(obj, {
    set: (target, prop, value) => {
      const metadata: emittedMetadata = {
        isDirty: target[prop] !== value
      };
      target[prop] = value;

      // If prop is a symbol or is a prop of the loudObj, return, nothing to do.
      if (typeof prop === 'symbol' || RESERVED_PROPERTIES.has(prop))
        return true;

      // If value is an object, create a loud object for it.
      if (typeof value === 'object') {
        value = loudify(value, options, target, prop);
      }

      // If value is not a function, emit the event.
      if (typeof value !== 'function') {
        loudObj.$emit(prop, value, metadata);
      }
      return true;
    }
  });

  loudObj.$isLoud = true;
  loudObj.$parent = parent;
  loudObj.$propName = propName;
  loudObj.$listeners = {} as Record<string, ListenerFn[]>;
  loudObj.$preventBubbling = false;

  loudObj.$on = (
    prop: unknown,
    listener: ListenerFn,
    onOptions: Partial<$onOptions> = {}
  ) => {
    // If prop is not a string, throw
    if (typeof prop !== 'string') {
      throw new Error('The first argument to $on() must be a string');
    }

    // If prop is a reserved property, throw
    if (RESERVED_PROPERTIES.has(prop)) {
      throw new Error(
        `Cannot listen to ${prop} as it is a reserved property and could potentially create an infinite loop.`
      );
    }

    onOptions = { ...$onDefaultOptions, ...onOptions };

    // If propr contains a wildcard and allowNesting is false, throw
    if (prop.includes('.') && !options.allowNesting) {
      throw new Error(
        'Cannot listen to a nested event if allowNesting is false'
      );
    }

    const initialListener = listener;
    // If once is true, create a new listener that will remove itself after being called
    if (onOptions.once) {
      listener = createOnceListener(initialListener, prop);
    }
    // If preventBubbling is true, create a new listener that will prevent the event from bubbling
    if (onOptions.preventBubbling) {
      listener = createPreventBubblingListener(initialListener);
    }

    createListenersForPropIfNotExists(prop);
    pushListenerForProp(prop, listener);
  };
  loudObj.$once = (prop: string, listener: ListenerFn) => {
    loudObj.$on(prop, listener, { once: true });
  };
  loudObj.$emit = (prop: string, value: unknown, metadata: emittedMetadata) => {
    if (hasListenersForProp(prop)) {
      getListenersForProp(prop).forEach((listen: ListenerFn) =>
        listen(value, metadata.originalPropertyName || prop, metadata)
      );
    }

    // If the event was prevented from bubbling, return
    if (loudObj.$preventBubbling) {
      loudObj.$preventBubbling = false;
      return;
    }

    if (loudObj.$parent) {
      const parentPropName = `${loudObj.$propName}.${prop}`;
      loudObj.$parent.$emit(parentPropName, value, metadata);
    }
    if (!prop.includes('*')) {
      emitWildcardEventForEachParentMatchingExpression(prop, value, metadata);
    }
  };
  loudObj.$off = (prop: string, listener: ListenerFn) => {
    if (hasListenersForProp(prop)) {
      setListenersForProp(
        prop,
        getListenersForProp(prop).filter((l: ListenerFn) => l !== listener)
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

  function hasListenersForProp(prop: string) {
    return loudObj.$listeners[prop] && loudObj.$listeners[prop].length > 0;
  }

  function getListenersForProp(prop: string) {
    return loudObj.$listeners[prop];
  }

  function setListenersForProp(prop: string, listeners: ListenerFn[]) {
    loudObj.$listeners[prop] = listeners;
  }

  function applyLoudifyToNestedProperties() {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        obj[key] = loudify(obj[key], options, obj, key);
      }
    });
  }

  function emitWildcardEventForEachParentMatchingExpression(
    prop: string,
    value: unknown,
    metadata: emittedMetadata
  ) {
    const propParts = prop.split('.');
    for (let i = propParts.length; i > 0; i--) {
      const wildcardProp = propParts.slice(0, i).join('.') + '.*';
      if (loudObj.$listeners[wildcardProp]) {
        loudObj.$emit(wildcardProp, value, {
          ...metadata,
          originalPropertyName: prop
        });
      }
    }
    if (loudObj.$listeners['*']) {
      loudObj.$emit('*', value, {
        ...metadata,
        originalPropertyName: prop
      });
    }
  }

  function createPreventBubblingListener(initialListener) {
    return function newListener(...args: unknown[]) {
      initialListener(...args);
      loudObj.$preventBubbling = true;
    };
  }

  function createOnceListener(initialListener: ListenerFn, prop: string) {
    return function newListener(...args: unknown[]) {
      initialListener(...args);
      loudObj.$off(prop, newListener);
    };
  }

  function createListenersForPropIfNotExists(prop: string) {
    if (!loudObj.$listeners[prop]) {
      loudObj.$listeners[prop] = [];
    }
  }

  function pushListenerForProp(prop: string, listener: ListenerFn) {
    loudObj.$listeners[prop].push(listener);
  }
};
