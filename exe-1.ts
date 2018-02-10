import { expect } from './expect';


// Implementation
interface Node {
  eval(): number;
  toString(): string;
}

class Value implements Node {
  constructor(private val: number) { }
  eval = () => this.val;
  toString = () => this.val.toString();
}

class Sum implements Node {
  constructor(private val1: Node, private val2: Node) { }
  eval = () => this.val1.eval() + this.val2.eval();
  toString = () => `${this.val1.toString()}+${this.val2.toString()}`;
}

// Tests
expect(new Value(5).eval(), 5);
expect(new Value(5).toString(), '5');
expect(new Sum(new Value(1), new Value(2)).eval(), 3);
expect(new Sum(new Value(1), new Sum(new Value(2), new Value(3))).eval(), 6);
expect(new Sum(new Value(1), new Sum(new Value(2), new Value(3))).toString(), '1+2+3');