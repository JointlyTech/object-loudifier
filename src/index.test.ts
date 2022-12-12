// Create tests using Jest

import { r } from './lib';

it('should create a reactive object', () => {
  const obj = r({});
  expect(obj.$isReactive).toBe(true);
});

it('should throw if the object is not an object', () => {
  expect(() => r(1)).toThrow();
});

it('should throw if the object is an array', () => {
  expect(() => r([])).toThrow();
});

it('should throw if the object is null', () => {
  expect(() => r(null)).toThrow();
});

it('should throw if the object contains a reserved property', () => {
  expect(() =>
    r({
      $on: () => {
        return;
      }
    })
  ).toThrow();
});

it('should create an r for every property of the object if an object itself', () => {
  const obj = r({
    a: {
      b: 1
    }
  });
  expect(obj.a.$isReactive).toBe(true);
});

it('should $emit when a property is set', () => {
  const obj = r({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.a = 1;
  expect(callback).toBeCalledWith(1);
});

it('should $emit when a new property, which is an object, is added and modified', () => {
  const obj = r({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.a = { b: { c: 1 } };
  expect(callback).toBeCalledWith({ b: { c: 1 } });
  const callback2 = jest.fn();
  obj.$on('a.b', callback2);
  obj.a.b = { c: 3 };
  expect(callback).toBeCalledWith({ b: { c: 3 } });
});

it('should only emit once if you use $once', () => {
  const obj = r({});
  const callback = jest.fn();
  obj.$once('a', callback);
  obj.a = 1;
  obj.a = 2;
  expect(callback).toBeCalledWith(1);
  expect(callback).toBeCalledTimes(1);
});

it('should emit the correct anount of times when a wildcard is used', () => {
  const obj = r({
    a: {
      b: {
        c: {
          d: 1
        }
      }
    }
  });
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

it('should not emit in case I $off', () => {
  const obj = r({});
  const callback = jest.fn();
  obj.$on('a', callback);
  obj.$off('a', callback);
  obj.a = 1;
  expect(callback).not.toBeCalled();
});