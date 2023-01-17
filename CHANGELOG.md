#### 2.1.1 (2023-01-17)

##### Chores

*  linting ([09e54b63](https://github.com/JointlyTech/object-loudifier/commit/09e54b63d291c6eab9e8780d31186d19846e487e))

##### Documentation Changes

*  added usage example ([44167021](https://github.com/JointlyTech/object-loudifier/commit/44167021b46fa4d5320cb3443655249ef55d192c))

##### Performance Improvements

*  moved listeners from obj to map. +10% ([a97200d8](https://github.com/JointlyTech/object-loudifier/commit/a97200d8e2f38ad796ebbf2b63397ba2ac20e047))
*  small perf improvements ([6234cf97](https://github.com/JointlyTech/object-loudifier/commit/6234cf97d4b29cedf93a0301203c3382dda739a1))

##### Refactors

*  internal naming and folders refactoring ([0ef8fa83](https://github.com/JointlyTech/object-loudifier/commit/0ef8fa8353e07798b8fb795036c13d2708105f1c))

### 2.1.0 (2022-12-21)

##### Chores

*  added shortcut for coverage command and removed redundant conf from jest config ([04aeacc1](https://github.com/JointlyTech/object-loudifier/commit/04aeacc1dc68a06d7fc04a4a47de947807649323))
*  lint ([59fc14c5](https://github.com/JointlyTech/object-loudifier/commit/59fc14c5d39767a5e6c96c97de056d4b4bfb2765))
*  better type enforcing ([5a88f919](https://github.com/JointlyTech/object-loudifier/commit/5a88f9191cc8e5ecbdf09b65663ad2f8aa1f4f25))

##### Documentation Changes

*  added benchmark n. 6 ([aad26879](https://github.com/JointlyTech/object-loudifier/commit/aad268791da57ab6239277a7307a73341a9b9a2d))

##### Bug Fixes

*  emit now return correct propName even if used with wildcards ([c37951c8](https://github.com/JointlyTech/object-loudifier/commit/c37951c897c00d1a217013b66c5f19e424af05e0))

##### Other Changes

* //github.com/JointlyTech/object-loudifier ([a4edda6b](https://github.com/JointlyTech/object-loudifier/commit/a4edda6b808a15d70c3581ea35012759f014f427))

##### Refactors

*  changed name for onOptions for better readability ([725a5416](https://github.com/JointlyTech/object-loudifier/commit/725a5416bc0621c6755c442bcf75878591e5a14e))

##### Tests

*  fixed some test to use latest features + adding test to improve code coverage ([4e7f3370](https://github.com/JointlyTech/object-loudifier/commit/4e7f33709cdae55e9e864d8699712f4ed7c0e73d))
*  added wildcard prop test ([d2cd44d8](https://github.com/JointlyTech/object-loudifier/commit/d2cd44d84dcc5c7fc661d64add593fd82bc0e96a))

## 2.0.0 (2022-12-15)

##### Chores

*  fixed benchmark execution ([348edbea](https://github.com/JointlyTech/object-loudifier/commit/348edbea31f59e074ac5d7aa9e3f078f5c3efe1a))
*  enforced type checking + exporting loud object type ([b61f21ad](https://github.com/JointlyTech/object-loudifier/commit/b61f21ad22dbac4e89ddf75828668d1be0c3ff66))

##### Documentation Changes

*  improved benchmark explanation ([dd1d2fac](https://github.com/JointlyTech/object-loudifier/commit/dd1d2fac61bd7ceb1ccb7bc85c2b1eec2483f3c9))
*  improved bubbling priority explanation ([8c29488e](https://github.com/JointlyTech/object-loudifier/commit/8c29488e16378249439ac722b840cbdb8678eb5f))

##### New Features

*  added emittedmetadata + internal checks refactor + tests ([fb5d8277](https://github.com/JointlyTech/object-loudifier/commit/fb5d8277428bee6c328a109040de32ac7e1092a4))

##### Other Changes

*  allow nesting mechanism + internal refactor + loudify options parameter + tests ([7e7e1c35](https://github.com/JointlyTech/object-loudifier/commit/7e7e1c35a83418000b887f065b2bd1f69b26345f))

##### Refactors

*  internal naming changes ([41589031](https://github.com/JointlyTech/object-loudifier/commit/41589031af41d8faf8b5482924ba9ed1ee85841e))

### 1.1.0 (2022-12-14)

##### Chores

*  added benchmarks ([ee157fe0](https://github.com/JointlyTech/object-loudifier/commit/ee157fe07bdcfb15ff34005fd1c8f9d467c3b4be))
*  added things to todo list ([923d6d58](https://github.com/JointlyTech/object-loudifier/commit/923d6d587f9df934ecedc9abcd237acc3f324f1d))
*  typo fix ([86452201](https://github.com/JointlyTech/object-loudifier/commit/86452201d51e3ce31e595223a97be0f63e4ec7d3))

##### Documentation Changes

*  updated documentation refactoring some parts + explained bubbling order ([46527dc9](https://github.com/JointlyTech/object-loudifier/commit/46527dc9ef3b2a60af58edd76bd244304b01333b))

##### New Features

*  internal refactor of once + internal refactor of on to allow for more options ([7945bdb8](https://github.com/JointlyTech/object-loudifier/commit/7945bdb8c3056178c4d70e63d037d083578e6077))
*  added bubbling prevention ([1c51d074](https://github.com/JointlyTech/object-loudifier/commit/1c51d074d3a8a9a7dda07422a6270af38c262397))

##### Bug Fixes

*  corrected infinite loop on ([11ba4c81](https://github.com/JointlyTech/object-loudifier/commit/11ba4c818a7c0921c127b18dc0786a6011c336a4))
*  fixed test execution results ([daf19c3b](https://github.com/JointlyTech/object-loudifier/commit/daf19c3b9bd5bc09bca92f29e881592794f6b333))

##### Other Changes

*  added tests to check bubbling ordering ([4920167a](https://github.com/JointlyTech/object-loudifier/commit/4920167afaadbe8c9fb32ee41197373eb87e4049))

#### 1.0.1 (2022-12-12)

##### Tests

*  fixed tests ([0853e3ca](https://github.com/JointlyTech/object-loudifier/commit/0853e3ca676461210fe58f9954c0fe684197e095))

## 1.0.0 (2022-12-12)

##### Other Changes

*  changed exported function name + updated docs ([d48ae7f6](https://github.com/JointlyTech/object-loudifier/commit/d48ae7f68b3c086f52d43e030c630a5aa9e2354b))

#### 0.0.3 (2022-12-12)

##### Chores

*  added commitlint ([1cb0852c](https://github.com/JointlyTech/object-loudifier/commit/1cb0852cb7c29b9390533e85cfea1cc642d8be94))

#### 0.0.2 (2022-12-12)

##### Chores

*  new scaffolding ([f572572c](https://github.com/JointlyTech/object-loudifier/commit/f572572c99c738558b7d1fcdc18a56a8624f709a))
*  Updating license, package and readme ([e89338ac](https://github.com/JointlyTech/object-loudifier/commit/e89338ac447416df95fe87a95fb00b004e12ad5b))
*  Added tests to lint-staged ([20c26693](https://github.com/JointlyTech/object-loudifier/commit/20c266938ba78b45a5a6a3d7ccaa89121884b021))

