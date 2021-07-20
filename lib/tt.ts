"use strict";

export module tt {
	
	/**
	 * Represents Pattern Callback actions returnvalues.
	 */
	export enum Act {
		STOP = 1, //stop propagation
		CONT = 2, //continue propagation - DEFAULT success
		UNREG = 4, //unregister pattern - to be used in bitmasked conjunction
		PASS = 8, //continue propagation - DEFAULT failure
	}
	
	/**
	 * To be called on Pattern matches.
	 */
	export type Callback<T, S = any, U = S> = (t: T, s: S, u: U, ...d: any[]) => Act;
	
	/**
	 * On success executes callback.
	 */
	export class Pattern extends RegExp {
		
		/**
		 * Subresource/inner-pattern
		 */
		public pattern: RegExp;
		/**
		 * 
		 * @param {Pattern} t - this
		 * @param {string} str - string matched against
		 * @param {number} i - index of testing
		 * @returns {Act} Action outcome
		 */
		public cb: Callback<Pattern, string, number> = (t: Pattern, str: string, i?: number): Act => Act.CONT;
		
		constructor(pattern: Pattern | RegExp | string, cb?: Callback<Pattern, string, number>) {
			super(pattern);
			
			let flags: string = "i";
			
			if (pattern instanceof Pattern) cb = pattern.cb;
			if (pattern instanceof RegExp) {
				flags	= pattern.flags;
				pattern	= pattern.source;
			}
			if (typeof pattern == "string") pattern = new RegExp(pattern, flags);
			
			
			if (cb instanceof Function) this.cb = cb;
			else if (cb) throw "Bad Callback";
			
			this.pattern = pattern;
		} //ctor
		
		get flags(): string {
			return this.pattern.flags;
		} //g-flags
		get source(): string {
			return this.pattern.source;
		} //g-source
		
		/**
		 * Attempt match and callback execution.
		 * 
		 * @param {string} str - string matched against
		 * @param {number} i - index of testing
		 * @returns {Act} Action outcome - PASS if omitted
		 */
		try(str: string, i: number = -1): Act {
			if (this.pattern.test(str))
				return this.cb(this, str, i) || Act.CONT;
			
			return Act.PASS;
		} //try
		
		[Symbol.match](str: string): RegExpMatchArray {
			return str.match(this.pattern) || [ ];
		}
		[Symbol.matchAll](str: string): IterableIterator<RegExpMatchArray> {
			return str.matchAll(this.pattern);
		}
		[Symbol.search](str: string): number {
			return str.search(this.pattern);
		}
		
		static get [Symbol.species]() {
			return RegExp;
		}
		
	} //Pattern
	
	export class TT {
		
		/**
		 * Patterns in order of calling
		 */
		public patterns: Pattern[] = [ ];
		
		constructor(patterns: Pattern[] | RegExp[] | string[] = [ ]) {
			if (patterns instanceof Array) this.reg(patterns);
			else throw "Bad Patterns";
		} //ctor
		
		/**
		 * Attempt matching.
		 * 
		 * @param {string} str - string matched against
		 * @returns {boolean} Match success.
		 */
		test(str: string): boolean {
			let ret: boolean = false;
			
			for (let i: number = 0; i < this.patterns.length; i++) {
				const p: Pattern = this.patterns[i],
					po: Act = p.try(str, i);
				
				if ((po & Act.UNREG) == Act.UNREG)	{ this.unreg(i--); ret = true; }
				if ((po & Act.STOP) == Act.STOP)	return true;
				if ((po & Act.CONT) == Act.CONT)	ret = true;
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
		reg(pat: Pattern[] | RegExp[] | string[] | Pattern | RegExp | string, idx?: number, rep: number = 0): Pattern[] {
			let opat: Pattern[];
			
			if (pat instanceof Array) opat = pat.map((p: Pattern | RegExp | string): Pattern => new Pattern(p));
			else opat = [new Pattern(pat)];
			
			if (idx && idx >= 0) this.patterns.splice(idx, rep, ...opat);
			else {
				while (rep--) this.patterns.pop();
				
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
		unreg(pat?: Pattern[] | number[] | Pattern | number): Pattern[] {
			let pats: Pattern[] = [ ];
			
			if (typeof pat == "undefined") return this.patterns.splice(0, this.patterns.length);
			else if (pat instanceof Array) {
				let remn: number = 0;
				
				pat.sort((a: Pattern | number, b: Pattern | number): number => {
					if (a instanceof Pattern) return 1;
					else if (b instanceof Pattern) return -1;
					else return a - b;
				}).forEach((p: Pattern | number): void => {
					const idx: number = p instanceof Pattern ? this.patterns.findIndex((pp: Pattern): boolean => pp == p) : (p - remn);
					
					if (idx >= 0) pats.push(...this.patterns.splice(idx, 1));
					if (typeof p == "number") remn++;
				});
			} else {
				const idx: number = pat instanceof Pattern ? this.patterns.findIndex((pp: Pattern): boolean => pp == pat) : pat;
				
				if (idx >= 0) pats.push(...this.patterns.splice(idx, 1));
			}
			
			return pats;
		} //unreg
		
		get [Symbol.isConcatSpreadable](): boolean {
			return true;
		}
		*[Symbol.iterator]() {
			yield* this.patterns;
		}
		static [Symbol.hasInstance](ins: any): boolean {
			return ins instanceof RegExp || ins instanceof TT || ins instanceof Pattern;
		}
		
	} //TT
	
} //tt

export default tt;
