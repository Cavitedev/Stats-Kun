const test = require("node:test");
const assert = require("node:assert");
const utils = require("../src/utils.js");

test("Minimum AR is 0", (t) => {
  let ar = getArWithEzHt(7.5);
  assert.strictEqual(ar, 0);
});

test("AR 7.6 with EZHT is 0.067", (t) => {
  let ar = getArWithEzHt(7.6);
  assert.strictEqual(Math.round(ar * 1000) / 1000, 0.067);
});

function getArWithEzHt(ar) {
  ar = ar / 2;
  let ms = utils.arToMs(ar);
  ms *= 4 / 3;
  ar = utils.msToAr(ms);
  return ar;
}
