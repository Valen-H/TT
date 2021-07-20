export declare module tt {
    enum Act {
        STOP = 1,
        CONT = 2,
        UNREG = 4,
        PASS = 8
    }
    type Callback<T, S> = (t: T, s: S) => Act;
    class Pattern extends RegExp {
        pattern: RegExp;
        cb: Callback<Pattern, string>;
        constructor(pattern: Pattern | RegExp | string, cb?: Callback<Pattern, string>);
        get flags(): string;
        try(str: string): Act;
        [Symbol.match](str: string): RegExpMatchArray;
        [Symbol.matchAll](str: string): IterableIterator<RegExpMatchArray>;
        static get [Symbol.species](): RegExpConstructor;
    }
    class TT {
        patterns: Pattern[];
        constructor(patterns?: Pattern[] | RegExp[] | string[]);
        test(str: string): boolean;
        reg(pat: Pattern[] | RegExp[] | string[] | Pattern | RegExp | string, idx?: number, rep?: number): Pattern | Pattern[];
        unreg(pat?: Pattern[] | number[] | Pattern | number): Pattern[];
        get [Symbol.isConcatSpreadable](): boolean;
        [Symbol.iterator](): Generator<Pattern, void, undefined>;
    }
}
export default tt;
//# sourceMappingURL=tt.d.ts.map