declare function suite(title: string, cb: () => void);
declare function test(title: string, cb: () => void);
declare function test(title: string, cb: (done:() => void) => void);
declare function setup(title: string, cb: () => void);
declare function teardown(title: string, cb: () => void);
declare function suite(cb: () => void);
declare function test(cb: () => void);
declare function test(cb: (done:() => void) => void);
declare function setup(cb: () => void);
declare function teardown(cb: () => void);

import chai = require('chai');

var assert = chai.assert;

suite('Array', () => {
  setup(() => {
    // ...
  });

  suite('#indexOf()', () => {
    test('should return -1 when not present', () => {
      // assert.equal(1, 1);
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

