"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tt = void 0;
var tt;
(function (tt) {
    let Act;
    (function (Act) {
        Act[Act["STOP"] = 1] = "STOP";
        Act[Act["CONT"] = 2] = "CONT";
        Act[Act["UNREG"] = 4] = "UNREG";
        Act[Act["PASS"] = 8] = "PASS";
    })(Act = tt.Act || (tt.Act = {}));
    class Pattern extends RegExp {
        pattern;
        cb = (t) => Act.CONT;
        constructor(pattern, cb) {
            if (typeof pattern == "string")
                pattern = new RegExp(pattern, "i");
            else if (pattern instanceof Pattern) {
                cb = pattern.cb;
                pattern = pattern.pattern;
            }
            else if (!(pattern instanceof RegExp))
                throw "Bad Pattern";
            super(pattern.source);
            if (cb instanceof Function)
                this.cb = cb;
            else if (cb)
                throw "Bad Callback";
            this.pattern = pattern;
        } //ctor
        get flags() {
            return this.pattern.flags;
        } //g-flags
        try(str) {
            if (this.pattern.test(str))
                return this.cb(this, str) || Act.CONT;
            return Act.PASS;
        } //test
        [Symbol.match](str) {
            const prec = str.match(this.pattern) || [];
            return prec;
        }
        [Symbol.matchAll](str) {
            const prec = str.matchAll(this.pattern);
            return prec;
        }
        static get [Symbol.species]() {
            return RegExp;
        }
    } //Pattern
    tt.Pattern = Pattern;
    class TT {
        patterns;
        constructor(patterns = []) {
            if (patterns instanceof Array)
                this.patterns = patterns.map((p) => new Pattern(p));
            else
                throw "Bad Patterns";
        } //ctor
        test(str) {
            let ret = false;
            for (let i = 0; i < this.patterns.length; i++) {
                const p = this.patterns[i], po = p.try(str);
                if ((po & Act.UNREG) == Act.UNREG) {
                    this.unreg(i--);
                    ret = true;
                }
                if ((po & Act.STOP) == Act.STOP)
                    return true;
                if ((po & Act.CONT) == Act.CONT)
                    ret = true;
            }
            return ret;
        } //test
        reg(pat, idx, rep = 0) {
            let opat;
            if (pat instanceof Array)
                opat = pat.map((p) => new Pattern(p));
            else
                opat = new Pattern(pat);
            if (opat instanceof Array) {
                if (idx && idx >= 0)
                    this.patterns.splice(idx, rep, ...opat);
                else {
                    while (rep--)
                        this.patterns.pop();
                    this.patterns.push(...opat);
                }
            }
            else {
                if (idx && idx >= 0)
                    this.patterns.splice(idx, rep, opat);
                else {
                    while (rep--)
                        this.patterns.pop();
                    this.patterns.push(opat);
                }
            }
            return opat;
        } //reg
        unreg(pat) {
            let pats = [];
            if (!pat)
                return this.patterns.splice(0, this.patterns.length);
            else if (pat instanceof Array) {
                let remn = 0;
                pat.sort((a, b) => {
                    if (a instanceof Pattern)
                        return 1;
                    else if (b instanceof Pattern)
                        return -1;
                    else
                        return a - b;
                }).forEach((p) => {
                    const idx = p instanceof Pattern ? this.patterns.findIndex((pp) => pp == p) : (p - remn);
                    if (idx >= 0)
                        pats.push(...this.patterns.splice(idx, 1));
                    if (typeof p == "number")
                        remn++;
                });
            }
            else {
                const idx = pat instanceof Pattern ? this.patterns.findIndex((pp) => pp == pat) : pat;
                if (idx >= 0)
                    pats.push(...this.patterns.splice(idx, 1));
            }
            return pats;
        } //unreg
        get [Symbol.isConcatSpreadable]() {
            return true;
        }
        *[Symbol.iterator]() {
            yield* this.patterns;
        }
    } //TT
    tt.TT = TT;
})(tt = exports.tt || (exports.tt = {})); //tt
exports.default = tt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixJQUFjLEVBQUUsQ0E4SWY7QUE5SUQsV0FBYyxFQUFFO0lBRWYsSUFBWSxHQUtYO0lBTEQsV0FBWSxHQUFHO1FBQ2QsNkJBQVEsQ0FBQTtRQUNSLDZCQUFRLENBQUE7UUFDUiwrQkFBUyxDQUFBO1FBQ1QsNkJBQVEsQ0FBQTtJQUNULENBQUMsRUFMVyxHQUFHLEdBQUgsTUFBRyxLQUFILE1BQUcsUUFLZDtJQUlELE1BQWEsT0FBUSxTQUFRLE1BQU07UUFFM0IsT0FBTyxDQUFTO1FBQ2hCLEVBQUUsR0FBOEIsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFaEUsWUFBWSxPQUFrQyxFQUFFLEVBQThCO1lBQzdFLElBQUksT0FBTyxPQUFPLElBQUksUUFBUTtnQkFBRSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUM5RCxJQUFJLE9BQU8sWUFBWSxPQUFPLEVBQUU7Z0JBQ3BDLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNoQixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUMxQjtpQkFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLFlBQVksTUFBTSxDQUFDO2dCQUFFLE1BQU0sYUFBYSxDQUFDO1lBRTdELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEIsSUFBSSxFQUFFLFlBQVksUUFBUTtnQkFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztpQkFDcEMsSUFBSSxFQUFFO2dCQUFFLE1BQU0sY0FBYyxDQUFDO1lBRWxDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxNQUFNO1FBRVIsSUFBSSxLQUFLO1lBQ1Is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LFFBQVEsQ0FBQztRQUN0QixDQUFDO0tBRUQsQ0FBQyxJQUFJO0lBakZPLEtBQUUsS0FpRmQsQ0FBQTtBQUVGLENBQUMsRUE5SWEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBOElmLENBQUMsSUFBSTtBQUVOLGtCQUFlLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZXhwb3J0IG1vZHVsZSB0dCB7XHJcblx0XHJcblx0ZXhwb3J0IGVudW0gQWN0IHtcclxuXHRcdFNUT1AgPSAxLFxyXG5cdFx0Q09OVCA9IDIsXHJcblx0XHRVTlJFRyA9IDQsXHJcblx0XHRQQVNTID0gOCxcclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IHR5cGUgQ2FsbGJhY2s8VCwgUz4gPSAodDogVCwgczogUykgPT4gQWN0O1xyXG5cdFxyXG5cdGV4cG9ydCBjbGFzcyBQYXR0ZXJuIGV4dGVuZHMgUmVnRXhwIHtcclxuXHRcdFxyXG5cdFx0cHVibGljIHBhdHRlcm46IFJlZ0V4cDtcclxuXHRcdHB1YmxpYyBjYjogQ2FsbGJhY2s8UGF0dGVybiwgc3RyaW5nPiA9ICh0OiBQYXR0ZXJuKSA9PiBBY3QuQ09OVDtcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IocGF0dGVybjogUGF0dGVybiB8IFJlZ0V4cCB8IHN0cmluZywgY2I/OiBDYWxsYmFjazxQYXR0ZXJuLCBzdHJpbmc+KSB7XHJcblx0XHRcdGlmICh0eXBlb2YgcGF0dGVybiA9PSBcInN0cmluZ1wiKSBwYXR0ZXJuID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCBcImlcIik7XHJcblx0XHRcdGVsc2UgaWYgKHBhdHRlcm4gaW5zdGFuY2VvZiBQYXR0ZXJuKSB7XHJcblx0XHRcdFx0Y2IgPSBwYXR0ZXJuLmNiO1xyXG5cdFx0XHRcdHBhdHRlcm4gPSBwYXR0ZXJuLnBhdHRlcm47XHJcblx0XHRcdH0gZWxzZSBpZiAoIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkgdGhyb3cgXCJCYWQgUGF0dGVyblwiO1xyXG5cdFx0XHRcclxuXHRcdFx0c3VwZXIocGF0dGVybi5zb3VyY2UpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGNiIGluc3RhbmNlb2YgRnVuY3Rpb24pIHRoaXMuY2IgPSBjYjtcclxuXHRcdFx0ZWxzZSBpZiAoY2IpIHRocm93IFwiQmFkIENhbGxiYWNrXCI7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xyXG5cdFx0fSAvL2N0b3JcclxuXHRcdFxyXG5cdFx0Z2V0IGZsYWdzKCk6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhdHRlcm4uZmxhZ3M7XHJcblx0XHR9IC8vZy1mbGFnc1xyXG5cdFx0XHJcblx0XHR0cnkoc3RyOiBzdHJpbmcpOiBBY3Qge1xyXG5cdFx0XHRpZiAodGhpcy5wYXR0ZXJuLnRlc3Qoc3RyKSlcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jYih0aGlzLCBzdHIpIHx8IEFjdC5DT05UO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIEFjdC5QQVNTO1xyXG5cdFx0fSAvL3Rlc3RcclxuXHRcdFxyXG5cdFx0W1N5bWJvbC5tYXRjaF0oc3RyOiBzdHJpbmcpIHtcclxuXHRcdFx0Y29uc3QgcHJlYzogUmVnRXhwTWF0Y2hBcnJheSA9IHN0ci5tYXRjaCh0aGlzLnBhdHRlcm4pIHx8IFsgXTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBwcmVjO1xyXG5cdFx0fVxyXG5cdFx0W1N5bWJvbC5tYXRjaEFsbF0oc3RyOiBzdHJpbmcpOiBJdGVyYWJsZUl0ZXJhdG9yPFJlZ0V4cE1hdGNoQXJyYXk+IHtcclxuXHRcdFx0Y29uc3QgcHJlYzogSXRlcmFibGVJdGVyYXRvcjxSZWdFeHBNYXRjaEFycmF5PiA9IHN0ci5tYXRjaEFsbCh0aGlzLnBhdHRlcm4pO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHByZWM7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHN0YXRpYyBnZXQgW1N5bWJvbC5zcGVjaWVzXSgpIHtcclxuXHRcdFx0cmV0dXJuIFJlZ0V4cDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0gLy9QYXR0ZXJuXHJcblx0XHJcblx0ZXhwb3J0IGNsYXNzIFRUIHtcclxuXHRcdFxyXG5cdFx0cHVibGljIHBhdHRlcm5zOiBQYXR0ZXJuW107XHJcblx0XHRcclxuXHRcdGNvbnN0cnVjdG9yKHBhdHRlcm5zOiBQYXR0ZXJuW10gfCBSZWdFeHBbXSB8IHN0cmluZ1tdID0gWyBdKSB7XHJcblx0XHRcdGlmIChwYXR0ZXJucyBpbnN0YW5jZW9mIEFycmF5KSB0aGlzLnBhdHRlcm5zID0gcGF0dGVybnMubWFwKChwOiBQYXR0ZXJuIHwgUmVnRXhwIHwgc3RyaW5nKTogUGF0dGVybiA9PiBuZXcgUGF0dGVybihwKSk7XHJcblx0XHRcdGVsc2UgdGhyb3cgXCJCYWQgUGF0dGVybnNcIjtcclxuXHRcdH0gLy9jdG9yXHJcblx0XHRcclxuXHRcdHRlc3Qoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdFx0bGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGF0dGVybnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBwOiBQYXR0ZXJuID0gdGhpcy5wYXR0ZXJuc1tpXSxcclxuXHRcdFx0XHRcdHBvOiBBY3QgPSBwLnRyeShzdHIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICgocG8gJiBBY3QuVU5SRUcpID09IEFjdC5VTlJFRylcdHsgdGhpcy51bnJlZyhpLS0pOyByZXQgPSB0cnVlOyB9XHJcblx0XHRcdFx0aWYgKChwbyAmIEFjdC5TVE9QKSA9PSBBY3QuU1RPUClcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGlmICgocG8gJiBBY3QuQ09OVCkgPT0gQWN0LkNPTlQpXHRyZXQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcmV0O1xyXG5cdFx0fSAvL3Rlc3RcclxuXHRcdFxyXG5cdFx0cmVnKHBhdDogUGF0dGVybltdIHwgUmVnRXhwW10gfCBzdHJpbmdbXSB8IFBhdHRlcm4gfCBSZWdFeHAgfCBzdHJpbmcsIGlkeD86IG51bWJlciwgcmVwOiBudW1iZXIgPSAwKTogUGF0dGVybiB8IFBhdHRlcm5bXSB7XHJcblx0XHRcdGxldCBvcGF0OiBQYXR0ZXJuIHwgUGF0dGVybltdO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHBhdCBpbnN0YW5jZW9mIEFycmF5KSBvcGF0ID0gcGF0Lm1hcCgocDogUGF0dGVybiB8IFJlZ0V4cCB8IHN0cmluZyk6IFBhdHRlcm4gPT4gbmV3IFBhdHRlcm4ocCkpO1xyXG5cdFx0XHRlbHNlIG9wYXQgPSBuZXcgUGF0dGVybihwYXQpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKG9wYXQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHRcdGlmIChpZHggJiYgaWR4ID49IDApIHRoaXMucGF0dGVybnMuc3BsaWNlKGlkeCwgcmVwLCAuLi5vcGF0KTtcclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHdoaWxlIChyZXAtLSkgdGhpcy5wYXR0ZXJucy5wb3AoKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGhpcy5wYXR0ZXJucy5wdXNoKC4uLm9wYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoaWR4ICYmIGlkeCA+PSAwKSB0aGlzLnBhdHRlcm5zLnNwbGljZShpZHgsIHJlcCwgb3BhdCk7XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR3aGlsZSAocmVwLS0pIHRoaXMucGF0dGVybnMucG9wKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMucGF0dGVybnMucHVzaChvcGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBvcGF0O1xyXG5cdFx0fSAvL3JlZ1xyXG5cdFx0dW5yZWcocGF0PzogUGF0dGVybltdIHwgbnVtYmVyW10gfCBQYXR0ZXJuIHwgbnVtYmVyKTogUGF0dGVybltdIHtcclxuXHRcdFx0bGV0IHBhdHM6IFBhdHRlcm5bXSA9IFsgXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghcGF0KSByZXR1cm4gdGhpcy5wYXR0ZXJucy5zcGxpY2UoMCwgdGhpcy5wYXR0ZXJucy5sZW5ndGgpO1xyXG5cdFx0XHRlbHNlIGlmIChwYXQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHRcdGxldCByZW1uOiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHBhdC5zb3J0KChhOiBQYXR0ZXJuIHwgbnVtYmVyLCBiOiBQYXR0ZXJuIHwgbnVtYmVyKTogbnVtYmVyID0+IHtcclxuXHRcdFx0XHRcdGlmIChhIGluc3RhbmNlb2YgUGF0dGVybikgcmV0dXJuIDE7XHJcblx0XHRcdFx0XHRlbHNlIGlmIChiIGluc3RhbmNlb2YgUGF0dGVybikgcmV0dXJuIC0xO1xyXG5cdFx0XHRcdFx0ZWxzZSByZXR1cm4gYSAtIGI7XHJcblx0XHRcdFx0fSkuZm9yRWFjaCgocDogUGF0dGVybiB8IG51bWJlcik6IHZvaWQgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgaWR4OiBudW1iZXIgPSBwIGluc3RhbmNlb2YgUGF0dGVybiA/IHRoaXMucGF0dGVybnMuZmluZEluZGV4KChwcDogUGF0dGVybik6IGJvb2xlYW4gPT4gcHAgPT0gcCkgOiAocCAtIHJlbW4pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoaWR4ID49IDApIHBhdHMucHVzaCguLi50aGlzLnBhdHRlcm5zLnNwbGljZShpZHgsIDEpKTtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgcCA9PSBcIm51bWJlclwiKSByZW1uKys7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgaWR4OiBudW1iZXIgPSBwYXQgaW5zdGFuY2VvZiBQYXR0ZXJuID8gdGhpcy5wYXR0ZXJucy5maW5kSW5kZXgoKHBwOiBQYXR0ZXJuKTogYm9vbGVhbiA9PiBwcCA9PSBwYXQpIDogcGF0O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpZHggPj0gMCkgcGF0cy5wdXNoKC4uLnRoaXMucGF0dGVybnMuc3BsaWNlKGlkeCwgMSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcGF0cztcclxuXHRcdH0gLy91bnJlZ1xyXG5cdFx0XHJcblx0XHRnZXQgW1N5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVdKCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdCpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuXHRcdFx0eWllbGQqIHRoaXMucGF0dGVybnM7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9IC8vVFRcclxuXHRcclxufSAvL3R0XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0dDtcclxuIl19