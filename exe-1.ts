import { expect } from './expect';


// Implementation
interface Node {
  eval(): number;
  toString(): string;
}

class Value implements Node {
  constructor(private val) { }
  eval = () => this.val;
  toString = () => this.val.toString();
}


// Tests
expect(new Value(5).eval(), 5);
expect(new Value(5).toString(), '5');