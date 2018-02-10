import './exe-1';

export function expect(expected: any, actual: any) {
  if (expected != actual) {
    throw new Error(`Expected ${expected} to equal ${actual}.`);
  }
}

expect(1, 1);
expect('hello', 'hello');
try {
  expect(1, 'world');
} catch (err) { 
  if (err.message !== 'Expected 1 to equal world.'){
    throw new Error(`Expected test to fail, but didn't.`);
  }
}