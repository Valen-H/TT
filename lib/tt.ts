"use strict";

export module tt {
	
	export enum Act {
		STOP = 1,
		CONT = 2,
		UNREG = 4,
		PASS = 8,
	}
	
	export type Callback<T, S> = (t: T, s: S) => Act;
	
	export class Pattern extends RegExp {
		
		public pattern: RegExp;
		public cb: Callback<Pattern, string> = (t: Pattern) => Act.CONT;
		
		constructor(pattern: Pattern | RegExp | string, cb?: Callback<Pattern, string>) {
			if (typeof pattern == "string") pattern = new RegExp(pattern, "i");
			else if (pattern instanceof Pattern) {
				cb = pattern.cb;
				pattern = pattern.pattern;
			} else if (!(pattern instanceof RegExp)) throw "Bad Pattern";
			
			super(pattern.source);
			
			if (cb instanceof Function) this.cb = cb;
			else if (cb) throw "Bad Callback";
			
			this.pattern = pattern;
		} //ctor
		
		get flags(): string {
			return this.pattern.flags;
		} //g-flags
		
		try(str: string): Act {
			if (this.pattern.test(str))
				return this.cb(this, str) || Act.CONT;
			
			return Act.PASS;
		} //test
		
		[Symbol.match](str: string) {
			const prec: RegExpMatchArray = str.match(this.pattern) || [ ];
			
			return prec;
		}
		[Symbol.matchAll](str: string): IterableIterator<RegExpMatchArray> {
			const prec: IterableIterator<RegExpMatchArray> = str.matchAll(this.pattern);
			
			return prec;
		}
		
		static get [Symbol.species]() {
			return RegExp;
		}
		
	} //Pattern
	
	export class TT {
		
		public patterns: Pattern[];
		
		constructor(patterns: Pattern[] | RegExp[] | string[] = [ ]) {
			if (patterns instanceof Array) this.patterns = patterns.map((p: Pattern | RegExp | string): Pattern => new Pattern(p));
			else throw "Bad Patterns";
		} //ctor
		
		test(str: string): boolean {
			let ret: boolean = false;
			
			for (let i: number = 0; i < this.patterns.length; i++) {
				const p: Pattern = this.patterns[i],
					po: Act = p.try(str);
				
				if ((po & Act.UNREG) == Act.UNREG)	{ this.unreg(i--); ret = true; }
				if ((po & Act.STOP) == Act.STOP)	return true;
				if ((po & Act.CONT) == Act.CONT)	ret = true;
			}
			
			return ret;
		} //test
		
		reg(pat: Pattern[] | RegExp[] | string[] | Pattern | RegExp | string, idx?: number, rep: number = 0): Pattern | Pattern[] {
			let opat: Pattern | Pattern[];
			
			if (pat instanceof Array) opat = pat.map((p: Pattern | RegExp | string): Pattern => new Pattern(p));
			else opat = new Pattern(pat);
			
			if (opat instanceof Array) {
				if (idx && idx >= 0) this.patterns.splice(idx, rep, ...opat);
				else {
					while (rep--) this.patterns.pop();
					
					this.patterns.push(...opat);
				}
			} else {
				if (idx && idx >= 0) this.patterns.splice(idx, rep, opat);
				else {
					while (rep--) this.patterns.pop();
					
					this.patterns.push(opat);
				}
			}
			
			return opat;
		} //reg
		unreg(pat?: Pattern[] | number[] | Pattern | number): Pattern[] {
			let pats: Pattern[] = [ ];
			
			if (!pat) return this.patterns.splice(0, this.patterns.length);
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
		
	} //TT
	
} //tt

export default tt;
