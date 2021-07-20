"use strict";

const mod = require("../dist/lib/tt");
let p1 = new mod.tt.Pattern(/e/g, (t, str, i) => {
	console.log("GOT", str, t);
	
	if (i == 1) return 5;
	else return 2;
}),
	t1 = new mod.tt.TT([p1, p1, p1]);

console.log("TEST", t1);
console.log(t1.test("testytest"));
console.log(...t1);
