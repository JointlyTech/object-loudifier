// Create tests using Jest

import { loudify } from './lib';

it('should create a loud object', () => {
  const obj = loudify({});
  expect(obj.$isLoud).toBe(true);
});

it('should throw if the object is not an object', () => {
  expect(() => loudify(1)).toThrow();
});

it('should throw if the object is an array', () => {
  expect(() => loudify([])).toThrow();
});

it('should throw if the object is null', () => {
  expect(() => loudify(null)).toThrow();
});

it('should throw if the object contains a reserved property', () => {
  expect(() =>
    loudify({
      $on: () => {
        return;
      }
    })
  ).toThrow();
});

it('should create a loud object for every property of the object', () => {
  const obj = loudify(
    {
      a: {
        b: 1
      }
    },
    { allowNesting: true }
  );
  expect(obj.a.$isLoud).toBe(true);
});

it('should not create a loud object for every property of the object if allowNesting is false', () => {
  const obj = loudify({
    a: {
      b: 1
    }
  });
  expect(obj.a.$isLoud).toBe(undefined);
});

it('should emit when a property is set', () => {
  const obj = loudify({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.a = 1;
  expect(callback).toBeCalledWith(1, 'a', expect.anything());
});

it('should emit when a new property, which is an object, is added and modified', () => {
  const obj = loudify({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.a = { b: { c: 1 } };
  expect(callback).toBeCalledWith({ b: { c: 1 } }, 'a', expect.anything());
  const callback2 = jest.fn();
  obj.$on('a.b', callback2);
  obj.a.b = { c: 3 };
  expect(callback).toBeCalledWith({ b: { c: 3 } }, 'a', expect.anything());
});

it('should only emit once if you use $once', () => {
  const obj = loudify({});
  const callback = jest.fn();
  obj.$once('a', callback);
  obj.a = 1;
  obj.a = 2;
  expect(callback).toBeCalledWith(1, 'a', expect.anything());
  expect(callback).toBeCalledTimes(1);
});

it('should emit the correct amount of times when a wildcard is used', () => {
  const obj = loudify(
    {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    },
    { allowNesting: true }
  );
  const callback = jest.fn();
  obj.$on('*', callback);
  obj.a.b.c.d = 2;
  expect(callback).toBeCalledTimes(1);
  obj.$on('a.b.c', callback);
  obj.$on('a.b.*', callback);
  obj.$on('a.*', callback);
  obj.a.b.c.d = 2;
  expect(callback).toBeCalledTimes(4);
});

it('should not emit in case I off', () => {
  const obj = loudify({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.$off('a', callback);
  obj.a = 1;
  expect(callback).not.toBeCalled();
});

it('should preventBubbling', () => {
  const obj = loudify(
    {
      a: {
        b: {
          c: 1
        }
      }
    },
    { allowNesting: true }
  );
  const callback = jest.fn();
  obj.$on('a.b.c', callback);
  obj.$on('a.b', callback, true);
  obj.a.b.c = 2;
  expect(callback).toBeCalledTimes(1);
});

it('should respect the bubbling order', () => {
  const order: Array<number> = [];
  const obj = loudify(
    {
      a: {
        b: {
          c: 1
        }
      }
    },
    { allowNesting: true }
  );
  const callback1 = function () {
    order.push(1);
  };

  const callback2 = function () {
    order.push(2);
  };

  const callback3 = function () {
    order.push(3);
  };

  obj.a.b.$on('c', callback1);
  obj.$on('a.b.c', callback2);
  obj.$on('*', callback3);
  obj.a.b.c = 2;
  expect(order).toEqual([1, 2, 3]);
});

it('should return the correct dirtiness information via metadata', () => {
  const obj = loudify(
    {
      a: {
        b: {
          c: 1
        }
      }
    },
    { allowNesting: true }
  );
  obj.$on('*', (value, prop, metadata) => {
    expect(metadata.isDirty).toBe(true);
  });
  obj.a.$on('*', (value, prop, metadata) => {
    expect(metadata.isDirty).toBe(true);
  });
  obj.a.b.c = 2;

  const obj2 = loudify(
    {
      a: {
        b: {
          c: 1
        }
      }
    },
    { allowNesting: true }
  );
  obj2.$on('*', (value, prop, metadata) => {
    expect(metadata.isDirty).toBe(false);
  });
  obj2.a.$on('*', (value, prop, metadata) => {
    expect(metadata.isDirty).toBe(false);
  });
  obj2.a.b.c = 1;
});

it('should return correct property name when using wildcards', () => {
  const obj = loudify(
    {
      a: {
        b: {
          c: 1
        }
      }
    },
    { allowNesting: true }
  );
  obj.$on('*', (value, prop) => {
    expect(prop).toBe('a.b.c');
  });
  obj.a.$on('*', (value, prop) => {
    expect(prop).toBe('b.c');
  });
  obj.a.b.$on('*', (value, prop) => {
    expect(prop).toBe('c');
  });
  obj.a.b.c = 2;
});
