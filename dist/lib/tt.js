"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tt = void 0;
var tt;
(function (tt) {
    /**
     * Represents Pattern Callback actions returnvalues.
     */
    let Act;
    (function (Act) {
        Act[Act["STOP"] = 1] = "STOP";
        Act[Act["CONT"] = 2] = "CONT";
        Act[Act["UNREG"] = 4] = "UNREG";
        Act[Act["PASS"] = 8] = "PASS";
    })(Act = tt.Act || (tt.Act = {}));
    /**
     * On success executes callback.
     */
    class Pattern extends RegExp {
        /**
         * Subresource/inner-pattern
         */
        pattern;
        /**
         *
         * @param {Pattern} t - this
         * @param {string} str - string matched against
         * @param {number} i - index of testing
         * @returns {Act} Action outcome
         */
        cb = (t, str, i) => Act.CONT;
        constructor(pattern, cb) {
            super(pattern);
            let flags = "i";
            if (pattern instanceof Pattern)
                cb = pattern.cb;
            if (pattern instanceof RegExp) {
                flags = pattern.flags;
                pattern = pattern.source;
            }
            if (typeof pattern == "string")
                pattern = new RegExp(pattern, flags);
            if (cb instanceof Function)
                this.cb = cb;
            else if (cb)
                throw "Bad Callback";
            this.pattern = pattern;
        } //ctor
        get flags() {
            return this.pattern.flags;
        } //g-flags
        get source() {
            return this.pattern.source;
        } //g-source
        /**
         * Attempt match and callback execution.
         *
         * @param {string} str - string matched against
         * @param {number} i - index of testing
         * @returns {Act} Action outcome - PASS if omitted
         */
        try(str, i = -1) {
            if (this.pattern.test(str))
                return this.cb(this, str, i) || Act.CONT;
            return Act.PASS;
        } //try
        [Symbol.match](str) {
            return str.match(this.pattern) || [];
        }
        [Symbol.matchAll](str) {
            return str.matchAll(this.pattern);
        }
        [Symbol.search](str) {
            return str.search(this.pattern);
        }
        static get [Symbol.species]() {
            return RegExp;
        }
    } //Pattern
    tt.Pattern = Pattern;
    class TT {
        /**
         * Patterns in order of calling
         */
        patterns = [];
        constructor(patterns = []) {
            if (patterns instanceof Array)
                this.reg(patterns);
            else
                throw "Bad Patterns";
        } //ctor
        /**
         * Attempt matching.
         *
         * @param {string} str - string matched against
         * @returns {boolean} Match success.
         */
        test(str) {
            let ret = false;
            for (let i = 0; i < this.patterns.length; i++) {
                const p = this.patterns[i], po = p.try(str, i);
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
        /**
         * Register Pattern
         *
         * @param pat - pattern to (craft and) register
         * @param {number} [idx] - index to append to
         * @param {number} [rep=0] - patterns to replace
         * @returns {Pattern[]} Patterns added.
         */
        reg(pat, idx, rep = 0) {
            let opat;
            if (pat instanceof Array)
                opat = pat.map((p) => new Pattern(p));
            else
                opat = [new Pattern(pat)];
            if (idx && idx >= 0)
                this.patterns.splice(idx, rep, ...opat);
            else {
                while (rep--)
                    this.patterns.pop();
                this.patterns.push(...opat);
            }
            return opat;
        } //reg
        /**
         * Unregister Pattern(s).
         *
         * @param [pat] - pattern(s) to unregister
         * @returns {Pattern[]} Unregistered Patterns.
         */
        unreg(pat) {
            let pats = [];
            if (typeof pat == "undefined")
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
        static [Symbol.hasInstance](ins) {
            return ins instanceof RegExp || ins instanceof TT || ins instanceof Pattern;
        }
    } //TT
    tt.TT = TT;
})(tt = exports.tt || (exports.tt = {})); //tt
exports.default = tt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixJQUFjLEVBQUUsQ0ErTGY7QUEvTEQsV0FBYyxFQUFFO0lBRWY7O09BRUc7SUFDSCxJQUFZLEdBS1g7SUFMRCxXQUFZLEdBQUc7UUFDZCw2QkFBUSxDQUFBO1FBQ1IsNkJBQVEsQ0FBQTtRQUNSLCtCQUFTLENBQUE7UUFDVCw2QkFBUSxDQUFBO0lBQ1QsQ0FBQyxFQUxXLEdBQUcsR0FBSCxNQUFHLEtBQUgsTUFBRyxRQUtkO0lBT0Q7O09BRUc7SUFDSCxNQUFhLE9BQVEsU0FBUSxNQUFNO1FBRWxDOztXQUVHO1FBQ0ksT0FBTyxDQUFTO1FBQ3ZCOzs7Ozs7V0FNRztRQUNJLEVBQUUsR0FBc0MsQ0FBQyxDQUFVLEVBQUUsR0FBVyxFQUFFLENBQVUsRUFBTyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUV0RyxZQUFZLE9BQWtDLEVBQUUsRUFBc0M7WUFDckYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWYsSUFBSSxLQUFLLEdBQVcsR0FBRyxDQUFDO1lBRXhCLElBQUksT0FBTyxZQUFZLE9BQU87Z0JBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDaEQsSUFBSSxPQUFPLFlBQVksTUFBTSxFQUFFO2dCQUM5QixLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDdEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7YUFDekI7WUFDRCxJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVE7Z0JBQUUsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUdyRSxJQUFJLEVBQUUsWUFBWSxRQUFRO2dCQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO2lCQUNwQyxJQUFJLEVBQUU7Z0JBQUUsTUFBTSxjQUFjLENBQUM7WUFFbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDeEIsQ0FBQyxDQUFDLE1BQU07UUFFUixJQUFJLEtBQUs7WUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxTQUFTO1FBQ1gsSUFBSSxNQUFNO1lBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM1QixDQUFDLENBQUMsVUFBVTtRQUVaOzs7Ozs7V0FNRztRQUNILEdBQUcsQ0FBQyxHQUFXLEVBQUUsSUFBWSxDQUFDLENBQUM7WUFDOUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFMUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxLQUFLO1FBRVAsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBVztZQUN6QixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUcsQ0FBQztRQUN2QyxDQUFDO1FBQ0QsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBVztZQUM1QixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFXO1lBQzFCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDMUIsT0FBTyxNQUFNLENBQUM7UUFDZixDQUFDO0tBRUQsQ0FBQyxTQUFTO0lBckVFLFVBQU8sVUFxRW5CLENBQUE7SUFFRCxNQUFhLEVBQUU7UUFFZDs7V0FFRztRQUNJLFFBQVEsR0FBYyxFQUFHLENBQUM7UUFFakMsWUFBWSxXQUE0QyxFQUFHO1lBQzFELElBQUksUUFBUSxZQUFZLEtBQUs7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Z0JBQzdDLE1BQU0sY0FBYyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxNQUFNO1FBRVI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsR0FBVztZQUNmLElBQUksR0FBRyxHQUFZLEtBQUssQ0FBQztZQUV6QixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RELE1BQU0sQ0FBQyxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQ2xDLEVBQUUsR0FBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztpQkFBRTtnQkFDbkUsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUk7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJO29CQUFFLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDNUM7WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNaLENBQUMsQ0FBQyxNQUFNO1FBRVI7Ozs7Ozs7V0FPRztRQUNILEdBQUcsQ0FBQyxHQUFnRSxFQUFFLEdBQVksRUFBRSxNQUFjLENBQUM7WUFDbEcsSUFBSSxJQUFlLENBQUM7WUFFcEIsSUFBSSxHQUFHLFlBQVksS0FBSztnQkFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQTRCLEVBQVcsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUMvRixJQUFJLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRS9CLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0osT0FBTyxHQUFHLEVBQUU7b0JBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFFbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUM1QjtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLEtBQUs7UUFDUDs7Ozs7V0FLRztRQUNILEtBQUssQ0FBQyxHQUE2QztZQUNsRCxJQUFJLElBQUksR0FBYyxFQUFHLENBQUM7WUFFMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxXQUFXO2dCQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQy9FLElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtnQkFDOUIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO2dCQUVyQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBbUIsRUFBRSxDQUFtQixFQUFVLEVBQUU7b0JBQzdELElBQUksQ0FBQyxZQUFZLE9BQU87d0JBQUUsT0FBTyxDQUFDLENBQUM7eUJBQzlCLElBQUksQ0FBQyxZQUFZLE9BQU87d0JBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzs7d0JBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBbUIsRUFBUSxFQUFFO29CQUN4QyxNQUFNLEdBQUcsR0FBVyxDQUFDLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQVcsRUFBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFFbkgsSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELElBQUksT0FBTyxDQUFDLElBQUksUUFBUTt3QkFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLENBQUM7YUFDSDtpQkFBTTtnQkFDTixNQUFNLEdBQUcsR0FBVyxHQUFHLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQVcsRUFBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBRWhILElBQUksR0FBRyxJQUFJLENBQUM7b0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pEO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUMsT0FBTztRQUVULElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQ0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN0QixDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQVE7WUFDbkMsT0FBTyxHQUFHLFlBQVksTUFBTSxJQUFJLEdBQUcsWUFBWSxFQUFFLElBQUksR0FBRyxZQUFZLE9BQU8sQ0FBQztRQUM3RSxDQUFDO0tBRUQsQ0FBQyxJQUFJO0lBbEdPLEtBQUUsS0FrR2QsQ0FBQTtBQUVGLENBQUMsRUEvTGEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBK0xmLENBQUMsSUFBSTtBQUVOLGtCQUFlLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZXhwb3J0IG1vZHVsZSB0dCB7XHJcblx0XHJcblx0LyoqXHJcblx0ICogUmVwcmVzZW50cyBQYXR0ZXJuIENhbGxiYWNrIGFjdGlvbnMgcmV0dXJudmFsdWVzLlxyXG5cdCAqL1xyXG5cdGV4cG9ydCBlbnVtIEFjdCB7XHJcblx0XHRTVE9QID0gMSwgLy9zdG9wIHByb3BhZ2F0aW9uXHJcblx0XHRDT05UID0gMiwgLy9jb250aW51ZSBwcm9wYWdhdGlvbiAtIERFRkFVTFQgc3VjY2Vzc1xyXG5cdFx0VU5SRUcgPSA0LCAvL3VucmVnaXN0ZXIgcGF0dGVybiAtIHRvIGJlIHVzZWQgaW4gYml0bWFza2VkIGNvbmp1bmN0aW9uXHJcblx0XHRQQVNTID0gOCwgLy9jb250aW51ZSBwcm9wYWdhdGlvbiAtIERFRkFVTFQgZmFpbHVyZVxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBUbyBiZSBjYWxsZWQgb24gUGF0dGVybiBtYXRjaGVzLlxyXG5cdCAqL1xyXG5cdGV4cG9ydCB0eXBlIENhbGxiYWNrPFQsIFMgPSBhbnksIFUgPSBTPiA9ICh0OiBULCBzOiBTLCB1OiBVLCAuLi5kOiBhbnlbXSkgPT4gQWN0O1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIE9uIHN1Y2Nlc3MgZXhlY3V0ZXMgY2FsbGJhY2suXHJcblx0ICovXHJcblx0ZXhwb3J0IGNsYXNzIFBhdHRlcm4gZXh0ZW5kcyBSZWdFeHAge1xyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIFN1YnJlc291cmNlL2lubmVyLXBhdHRlcm5cclxuXHRcdCAqL1xyXG5cdFx0cHVibGljIHBhdHRlcm46IFJlZ0V4cDtcclxuXHRcdC8qKlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1BhdHRlcm59IHQgLSB0aGlzXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIG1hdGNoZWQgYWdhaW5zdFxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IGkgLSBpbmRleCBvZiB0ZXN0aW5nXHJcblx0XHQgKiBAcmV0dXJucyB7QWN0fSBBY3Rpb24gb3V0Y29tZVxyXG5cdFx0ICovXHJcblx0XHRwdWJsaWMgY2I6IENhbGxiYWNrPFBhdHRlcm4sIHN0cmluZywgbnVtYmVyPiA9ICh0OiBQYXR0ZXJuLCBzdHI6IHN0cmluZywgaT86IG51bWJlcik6IEFjdCA9PiBBY3QuQ09OVDtcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IocGF0dGVybjogUGF0dGVybiB8IFJlZ0V4cCB8IHN0cmluZywgY2I/OiBDYWxsYmFjazxQYXR0ZXJuLCBzdHJpbmcsIG51bWJlcj4pIHtcclxuXHRcdFx0c3VwZXIocGF0dGVybik7XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgZmxhZ3M6IHN0cmluZyA9IFwiaVwiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHBhdHRlcm4gaW5zdGFuY2VvZiBQYXR0ZXJuKSBjYiA9IHBhdHRlcm4uY2I7XHJcblx0XHRcdGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSB7XHJcblx0XHRcdFx0ZmxhZ3NcdD0gcGF0dGVybi5mbGFncztcclxuXHRcdFx0XHRwYXR0ZXJuXHQ9IHBhdHRlcm4uc291cmNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0eXBlb2YgcGF0dGVybiA9PSBcInN0cmluZ1wiKSBwYXR0ZXJuID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGNiIGluc3RhbmNlb2YgRnVuY3Rpb24pIHRoaXMuY2IgPSBjYjtcclxuXHRcdFx0ZWxzZSBpZiAoY2IpIHRocm93IFwiQmFkIENhbGxiYWNrXCI7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xyXG5cdFx0fSAvL2N0b3JcclxuXHRcdFxyXG5cdFx0Z2V0IGZsYWdzKCk6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhdHRlcm4uZmxhZ3M7XHJcblx0XHR9IC8vZy1mbGFnc1xyXG5cdFx0Z2V0IHNvdXJjZSgpOiBzdHJpbmcge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXR0ZXJuLnNvdXJjZTtcclxuXHRcdH0gLy9nLXNvdXJjZVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIEF0dGVtcHQgbWF0Y2ggYW5kIGNhbGxiYWNrIGV4ZWN1dGlvbi5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHN0cmluZyBtYXRjaGVkIGFnYWluc3RcclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBpIC0gaW5kZXggb2YgdGVzdGluZ1xyXG5cdFx0ICogQHJldHVybnMge0FjdH0gQWN0aW9uIG91dGNvbWUgLSBQQVNTIGlmIG9taXR0ZWRcclxuXHRcdCAqL1xyXG5cdFx0dHJ5KHN0cjogc3RyaW5nLCBpOiBudW1iZXIgPSAtMSk6IEFjdCB7XHJcblx0XHRcdGlmICh0aGlzLnBhdHRlcm4udGVzdChzdHIpKVxyXG5cdFx0XHRcdHJldHVybiB0aGlzLmNiKHRoaXMsIHN0ciwgaSkgfHwgQWN0LkNPTlQ7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gQWN0LlBBU1M7XHJcblx0XHR9IC8vdHJ5XHJcblx0XHRcclxuXHRcdFtTeW1ib2wubWF0Y2hdKHN0cjogc3RyaW5nKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcblx0XHRcdHJldHVybiBzdHIubWF0Y2godGhpcy5wYXR0ZXJuKSB8fCBbIF07XHJcblx0XHR9XHJcblx0XHRbU3ltYm9sLm1hdGNoQWxsXShzdHI6IHN0cmluZyk6IEl0ZXJhYmxlSXRlcmF0b3I8UmVnRXhwTWF0Y2hBcnJheT4ge1xyXG5cdFx0XHRyZXR1cm4gc3RyLm1hdGNoQWxsKHRoaXMucGF0dGVybik7XHJcblx0XHR9XHJcblx0XHRbU3ltYm9sLnNlYXJjaF0oc3RyOiBzdHJpbmcpOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gc3RyLnNlYXJjaCh0aGlzLnBhdHRlcm4pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzdGF0aWMgZ2V0IFtTeW1ib2wuc3BlY2llc10oKSB7XHJcblx0XHRcdHJldHVybiBSZWdFeHA7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9IC8vUGF0dGVyblxyXG5cdFxyXG5cdGV4cG9ydCBjbGFzcyBUVCB7XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUGF0dGVybnMgaW4gb3JkZXIgb2YgY2FsbGluZ1xyXG5cdFx0ICovXHJcblx0XHRwdWJsaWMgcGF0dGVybnM6IFBhdHRlcm5bXSA9IFsgXTtcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IocGF0dGVybnM6IFBhdHRlcm5bXSB8IFJlZ0V4cFtdIHwgc3RyaW5nW10gPSBbIF0pIHtcclxuXHRcdFx0aWYgKHBhdHRlcm5zIGluc3RhbmNlb2YgQXJyYXkpIHRoaXMucmVnKHBhdHRlcm5zKTtcclxuXHRcdFx0ZWxzZSB0aHJvdyBcIkJhZCBQYXR0ZXJuc1wiO1xyXG5cdFx0fSAvL2N0b3JcclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBBdHRlbXB0IG1hdGNoaW5nLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gc3RyaW5nIG1hdGNoZWQgYWdhaW5zdFxyXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59IE1hdGNoIHN1Y2Nlc3MuXHJcblx0XHQgKi9cclxuXHRcdHRlc3Qoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdFx0bGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGF0dGVybnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBwOiBQYXR0ZXJuID0gdGhpcy5wYXR0ZXJuc1tpXSxcclxuXHRcdFx0XHRcdHBvOiBBY3QgPSBwLnRyeShzdHIsIGkpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICgocG8gJiBBY3QuVU5SRUcpID09IEFjdC5VTlJFRylcdHsgdGhpcy51bnJlZyhpLS0pOyByZXQgPSB0cnVlOyB9XHJcblx0XHRcdFx0aWYgKChwbyAmIEFjdC5TVE9QKSA9PSBBY3QuU1RPUClcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGlmICgocG8gJiBBY3QuQ09OVCkgPT0gQWN0LkNPTlQpXHRyZXQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcmV0O1xyXG5cdFx0fSAvL3Rlc3RcclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWdpc3RlciBQYXR0ZXJuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSBwYXQgLSBwYXR0ZXJuIHRvIChjcmFmdCBhbmQpIHJlZ2lzdGVyXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW2lkeF0gLSBpbmRleCB0byBhcHBlbmQgdG9cclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbcmVwPTBdIC0gcGF0dGVybnMgdG8gcmVwbGFjZVxyXG5cdFx0ICogQHJldHVybnMge1BhdHRlcm5bXX0gUGF0dGVybnMgYWRkZWQuXHJcblx0XHQgKi9cclxuXHRcdHJlZyhwYXQ6IFBhdHRlcm5bXSB8IFJlZ0V4cFtdIHwgc3RyaW5nW10gfCBQYXR0ZXJuIHwgUmVnRXhwIHwgc3RyaW5nLCBpZHg/OiBudW1iZXIsIHJlcDogbnVtYmVyID0gMCk6IFBhdHRlcm5bXSB7XHJcblx0XHRcdGxldCBvcGF0OiBQYXR0ZXJuW107XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAocGF0IGluc3RhbmNlb2YgQXJyYXkpIG9wYXQgPSBwYXQubWFwKChwOiBQYXR0ZXJuIHwgUmVnRXhwIHwgc3RyaW5nKTogUGF0dGVybiA9PiBuZXcgUGF0dGVybihwKSk7XHJcblx0XHRcdGVsc2Ugb3BhdCA9IFtuZXcgUGF0dGVybihwYXQpXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpZHggJiYgaWR4ID49IDApIHRoaXMucGF0dGVybnMuc3BsaWNlKGlkeCwgcmVwLCAuLi5vcGF0KTtcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0d2hpbGUgKHJlcC0tKSB0aGlzLnBhdHRlcm5zLnBvcCgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMucGF0dGVybnMucHVzaCguLi5vcGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIG9wYXQ7XHJcblx0XHR9IC8vcmVnXHJcblx0XHQvKipcclxuXHRcdCAqIFVucmVnaXN0ZXIgUGF0dGVybihzKS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIFtwYXRdIC0gcGF0dGVybihzKSB0byB1bnJlZ2lzdGVyXHJcblx0XHQgKiBAcmV0dXJucyB7UGF0dGVybltdfSBVbnJlZ2lzdGVyZWQgUGF0dGVybnMuXHJcblx0XHQgKi9cclxuXHRcdHVucmVnKHBhdD86IFBhdHRlcm5bXSB8IG51bWJlcltdIHwgUGF0dGVybiB8IG51bWJlcik6IFBhdHRlcm5bXSB7XHJcblx0XHRcdGxldCBwYXRzOiBQYXR0ZXJuW10gPSBbIF07XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodHlwZW9mIHBhdCA9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gdGhpcy5wYXR0ZXJucy5zcGxpY2UoMCwgdGhpcy5wYXR0ZXJucy5sZW5ndGgpO1xyXG5cdFx0XHRlbHNlIGlmIChwYXQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHRcdGxldCByZW1uOiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHBhdC5zb3J0KChhOiBQYXR0ZXJuIHwgbnVtYmVyLCBiOiBQYXR0ZXJuIHwgbnVtYmVyKTogbnVtYmVyID0+IHtcclxuXHRcdFx0XHRcdGlmIChhIGluc3RhbmNlb2YgUGF0dGVybikgcmV0dXJuIDE7XHJcblx0XHRcdFx0XHRlbHNlIGlmIChiIGluc3RhbmNlb2YgUGF0dGVybikgcmV0dXJuIC0xO1xyXG5cdFx0XHRcdFx0ZWxzZSByZXR1cm4gYSAtIGI7XHJcblx0XHRcdFx0fSkuZm9yRWFjaCgocDogUGF0dGVybiB8IG51bWJlcik6IHZvaWQgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgaWR4OiBudW1iZXIgPSBwIGluc3RhbmNlb2YgUGF0dGVybiA/IHRoaXMucGF0dGVybnMuZmluZEluZGV4KChwcDogUGF0dGVybik6IGJvb2xlYW4gPT4gcHAgPT0gcCkgOiAocCAtIHJlbW4pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoaWR4ID49IDApIHBhdHMucHVzaCguLi50aGlzLnBhdHRlcm5zLnNwbGljZShpZHgsIDEpKTtcclxuXHRcdFx0XHRcdGlmICh0eXBlb2YgcCA9PSBcIm51bWJlclwiKSByZW1uKys7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgaWR4OiBudW1iZXIgPSBwYXQgaW5zdGFuY2VvZiBQYXR0ZXJuID8gdGhpcy5wYXR0ZXJucy5maW5kSW5kZXgoKHBwOiBQYXR0ZXJuKTogYm9vbGVhbiA9PiBwcCA9PSBwYXQpIDogcGF0O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpZHggPj0gMCkgcGF0cy5wdXNoKC4uLnRoaXMucGF0dGVybnMuc3BsaWNlKGlkeCwgMSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcGF0cztcclxuXHRcdH0gLy91bnJlZ1xyXG5cdFx0XHJcblx0XHRnZXQgW1N5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVdKCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdCpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuXHRcdFx0eWllbGQqIHRoaXMucGF0dGVybnM7XHJcblx0XHR9XHJcblx0XHRzdGF0aWMgW1N5bWJvbC5oYXNJbnN0YW5jZV0oaW5zOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdFx0cmV0dXJuIGlucyBpbnN0YW5jZW9mIFJlZ0V4cCB8fCBpbnMgaW5zdGFuY2VvZiBUVCB8fCBpbnMgaW5zdGFuY2VvZiBQYXR0ZXJuO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fSAvL1RUXHJcblx0XHJcbn0gLy90dFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdHQ7XHJcbiJdfQ==