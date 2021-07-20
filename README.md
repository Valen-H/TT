# TestTree

A pattern testing utility for parsing.

## Documentation

### Class `TT`

```typescript
//Craft a TT with initial patternlist
tt = new TT(patterns: Pattern[] | RegExp[] | string[] = [ ]);
tt.patterns; //Accumulated Patternlist

//(Un)Register new Pattern(s)
tt.reg(pattern: Pattern[] | RegExp[] | string[] | Pattern | RegExp | string): Pattern[];
tt.unreg(pattern: Pattern[] | Pattern): Pattern[];
tt.unreg(index: number[] | number): Pattern[];

//Test Patternlist and Act accordingly
tt.test(against: string): boolean;

//Iterate Patternlist
...tt;
```

### Class `Pattern` _extends RegExp_

```typescript
//Callback 'i' is the index of this Pattern inside parent paternlist
p = new Pattern(pattern: Pattern | RegExp | string, callback?: (t: this, str: string, i?: number): Act);
p.pattern; //Underlying RegExp
p.cb; //Underlying callback
p.flags //==p.pattern.flags
p.source //==p.pattern.source

//Attempt match with optional 'i'
//Act is returned by callback - defaults to CONT on match sucess and PASS on fail
try(str: string, i: number = -1): Act;
```

### Enum `Act`

```typescript
STOP  = 1 //stop propagation of patternlist
CONT  = 2 //continue propagation of patternlist - default of match success
UNREG = 4 //unregister pattern from patternlist - to be used in bitmasked conjunction of other Acts
PASS  = 8 //continue propagation - default of match failure
```

## Usage

```typescript
import { Pattern, TT, Act } from "testree/tt";

const p: Pattern = new Pattern(/e/g, (t: Pattern, s: string, i: number) => {
   console.log(t, s, i);
   
   if (i >= 2) return Act.UNREG | Act.STOP;
   else return Act.CONT;
}),
   P: TT = new TT([p, p, p, p]);

console.log(P.test("testy_test"), ...P);
```

> Made by ~ V.H. / 2021
