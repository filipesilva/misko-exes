import { expect } from './expect';


// Implementation
interface Node {
  prio: number;
  eval(): number;
  toString(prio: number): string;
}

function wrapParens(str: string, prioSelf: number, prioCaller: number) {
  return prioCaller > prioSelf ? `(${str})` : str;
}

class Value implements Node {
  prio = 0;
  constructor(private val: number) { }
  eval = () => this.val;
  toString = () => this.val.toString();
}

class Sum implements Node {
  prio = 1;
  constructor(private val1: Node, private val2: Node) { }
  eval = () => this.val1.eval() + this.val2.eval();
  toString = (prio = 0) => wrapParens(
    `${this.val1.toString(this.prio)}+${this.val2.toString(this.prio)}`,
    this.prio,
    prio
  );
}

class Multiplication implements Node {
  prio = 2;
  constructor(private val1: Node, private val2: Node) { }
  eval = () => this.val1.eval() * this.val2.eval();
  toString = (prio = 0) => wrapParens(
    `${this.val1.toString(this.prio)}x${this.val2.toString(this.prio)}`,
    this.prio,
    prio
  );
}

// Tests
expect(new Value(5).eval(), 5);
expect(new Value(5).toString(), '5');
expect(new Sum(new Value(1), new Value(2)).eval(), 3);
expect(new Sum(new Value(1), new Sum(new Value(2), new Value(3))).eval(), 6);
expect(new Sum(new Value(1), new Sum(new Value(2), new Value(3))).toString(), '1+2+3');
expect(new Multiplication(new Value(1), new Value(2)).eval(), 2);
expect(new Multiplication(new Value(1), new Multiplication(new Value(2), new Value(3))).eval(), 6);
expect(new Multiplication(new Value(1), new Multiplication(new Value(2), new Value(3))).toString(), '1x2x3');
expect(new Multiplication(new Sum(new Value(1), new Value(2)), new Value(3)).toString(), '(1+2)x3');
expect(new Multiplication(
  new Sum(new Value(1), new Value(2)),
  new Sum(new Value(3), new Value(4))
).toString(), '(1+2)x(3+4)');
expect(new Sum(
  new Multiplication(
    new Sum(new Value(1), new Value(2)),
    new Value(3)
  ),
  new Value(4)
).toString(), '(1+2)x3+4');