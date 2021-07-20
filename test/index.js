"use strict";

const mod = require("../dist/lib/tt");
let p1 = new mod.tt.Pattern(/e/g, (t, str) => console.log("GOT", str, t)),
	t1 = new mod.tt.TT([p1]);

console.log("TEST", t1);
console.log(t1.test("testytest"));
