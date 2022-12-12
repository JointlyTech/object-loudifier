```js
import { performance } from 'perf_hooks';
import { loudify } from '.';

(async () => {
  const obj = loudify({
    a: {
      b: {
        c: {
          d: 1
        }
      }
    }
  });
  obj.$on('*', (v) => {
    console.log('* -->', v);
    return;
  });
  obj.$on('a.*', (v) => {
    console.log('a.* -->', v);
    return;
  });
  obj.a.b = 1;
  obj.a.b = 2;
  const loudObj = loudify({
    nest2: {
      nest3: {
        nest4: {
          nest5: {
            nest6: 'valorenest6'
          }
        }
      }
    }
  });
  loudObj.$on('nest2.nest3.nest4.nest5.nest6', (value) => {
    console.log('FROM root  -->\t nest2.nest3.nest4.nest5.nest6', value);
  });
  loudObj.nest2.nest3.$on('nest4.nest5.nest6', (value) => {
    console.log('FROM nest3 -->\t nest2.nest3.nest4.nest5.nest6', value);
  });
  loudObj.nest2.nest3.nest4.nest5.nest6 = 'valorenest6modificato';
  loudObj.laterNest2 = {
    laterNest3: {
      laterNest4: 'laterNest4Value'
    }
  };
  loudObj.$on('laterNest2.laterNest3.laterNest4', (value) => {
    console.log('FROM root  -->\t laterNest2.laterNest3.laterNest4', value);
  });
  loudObj.laterNest2.laterNest3.$on('laterNest4', (value) => {
    console.log('FROM nest3 -->\t laterNest2.laterNest3.laterNest4', value);
  });
  loudObj.laterNest2.laterNest3.laterNest4 = 'laterNest4ValueModified';
  // Create a new reactive object, then listen for the * event.
  const obj2 = loudify({});
  obj2.$on('*', (v) => {
    return;
  });
  // Now mutate the object 1000 times and monitor the performance.
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    obj2[i] = i;
  }
  const end = performance.now();
  console.log('10000 mutations took', end - start, 'ms');
})();
```
