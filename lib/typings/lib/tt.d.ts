export declare module tt {
    /**
     * Represents Pattern Callback actions returnvalues.
     */
    enum Act {
        STOP = 1,
        CONT = 2,
        UNREG = 4,
        PASS = 8
    }
    /**
     * To be called on Pattern matches.
     */
    type Callback<T, S = any, U = S> = (t: T, s: S, u: U, ...d: any[]) => Act;
    /**
     * On success executes callback.
     */
    class Pattern extends RegExp {
        /**
         * Subresource/inner-pattern
         */
        pattern: RegExp;
        /**
         *
         * @param {Pattern} t - this
         * @param {string} str - string matched against
         * @param {number} i - index of testing
         * @returns {Act} Action outcome
         */
        cb: Callback<Pattern, string, number>;
        constructor(pattern: Pattern | RegExp | string, cb?: Callback<Pattern, string, number>);
        get flags(): string;
        get source(): string;
        /**
         * Attempt match and callback execution.
         *
         * @param {string} str - string matched against
         * @param {number} i - index of testing
         * @returns {Act} Action outcome - PASS if omitted
         */
        try(str: string, i?: number): Act;
        [Symbol.match](str: string): RegExpMatchArray;
        [Symbol.matchAll](str: string): IterableIterator<RegExpMatchArray>;
        [Symbol.search](str: string): number;
        static get [Symbol.species](): RegExpConstructor;
    }
    class TT {
        /**
         * Patterns in order of calling
         */
        patterns: Pattern[];
        constructor(patterns?: Pattern[] | RegExp[] | string[]);
        /**
         * Attempt matching.
         *
         * @param {string} str - string matched against
         * @returns {boolean} Match success.
         */
        test(str: string): boolean;
        /**
         * Register Pattern
         *
         * @param pat - pattern to (craft and) register
         * @param {number} [idx] - index to append to
         * @param {number} [rep=0] - patterns to replace
         * @returns {Pattern[]} Patterns added.
         */
        reg(pat: Pattern[] | RegExp[] | string[] | Pattern | RegExp | string, idx?: number, rep?: number): Pattern[];
        /**
         * Unregister Pattern(s).
         *
         * @param [pat] - pattern(s) to unregister
         * @returns {Pattern[]} Unregistered Patterns.
         */
        unreg(pat?: Pattern[] | number[] | Pattern | number): Pattern[];
        get [Symbol.isConcatSpreadable](): boolean;
        [Symbol.iterator](): Generator<Pattern, void, undefined>;
        static [Symbol.hasInstance](ins: any): boolean;
    }
}
export default tt;
//# sourceMappingURL=tt.d.ts.map