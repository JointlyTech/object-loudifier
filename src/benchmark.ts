/* eslint-disable no-console */

import { performance } from 'perf_hooks';
import { loudify } from './lib';

const iterations = 100000;

console.log('Benchmarking loudify...');
console.log(`Iterations: ${iterations}`);

/** BENCHMARK #1 - Simple object assignment */
console.log('Benchmark #1');
(() => {
  // Create an object
  const obj = { a: 0 };

  const start = performance.now();
  // Benchmark re-assigning obj.a `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify({ a: 0 });

  obj.$on('a', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();

/** BENCHMARK #2 - Object nested assignment */
console.log('Benchmark #2');
(() => {
  // Create an object
  const obj = { a: { b: 0 } };

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify({ a: { b: 0 } }, { allowNesting: true });

  obj.$on('a.b', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();

/** BENCHMARK #3 - Object nested assignment with wildcard */
console.log('Benchmark #3');
(() => {
  // Create an object
  const obj = { a: { b: 0 } };

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify({ a: { b: 0 } }, { allowNesting: true });

  obj.$on('*', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();

/** BENCHMARK #4 - Object nested assignment with wildcard and multiple listeners */
console.log('Benchmark #4');
(() => {
  // Create an object
  const obj = { a: { b: 0 } };

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify({ a: { b: 0 } }, { allowNesting: true });

  obj.$on('*', () => {
    return;
  });

  obj.$on('a.b', () => {
    return;
  });

  obj.$on('a.*', () => {
    return;
  });

  obj.a.$on('*', () => {
    return;
  });

  obj.a.$on('b', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();

/** BENCHMARK #5 - Object assignment with multiple nested properties */
console.log('Benchmark #5');
(() => {
  // Create an object
  const obj = { a: { b: 0 }, c: { d: 0 }, e: { f: { g: { h: 1 } } } };

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
    obj.c.d = i;
    obj.e.f.g.h = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify(
    { a: { b: 0 }, c: { d: 0 }, e: { f: { g: { h: 1 } } } },
    { allowNesting: true }
  );

  obj.$on('a.b', () => {
    return;
  });

  obj.$on('c.d', () => {
    return;
  });

  obj.$on('e.f.g.h', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
    obj.c.d = i;
    obj.e.f.g.h = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();

/** BENCHMARK #6 - Object assignment with multiple nested properties and wildcard */
console.log('Benchmark #6');
(() => {
  // Create an object
  const obj = { a: { b: 0 }, c: { d: 0 }, e: { f: { g: { h: 1 } } } };

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
    obj.c.d = i;
    obj.e.f.g.h = i;
  }

  const end = performance.now();
  console.log(`Time taken (without loudify): ${end - start}ms`);
})();

(() => {
  // Create a loud object
  const obj = loudify(
    { a: { b: 0 }, c: { d: 0 }, e: { f: { g: { h: 1 } } } },
    { allowNesting: true }
  );

  obj.$on('*', () => {
    return;
  });

  const start = performance.now();
  // Benchmark re-assigning obj.a.b `iterations` times
  for (let i = 0; i < iterations; i++) {
    obj.a.b = i;
    obj.c.d = i;
    obj.e.f.g.h = i;
  }

  const end = performance.now();
  console.log(`Time taken (with loudify): ${end - start}ms`);
})();
