import { expect } from './expect';


// Implementation
interface HashEntry<KeyT, ValueT> {
  key: KeyT;
  value: ValueT;
}

// Does not resize.
class HashMap<KeyT, ValueT> {
  // A prime as size is needed for the used universal hashing function (see this._hashFn).
  private _size = 179;
  private _buckets = new Array<HashEntry<KeyT, ValueT>[]>(this._size);
  private _randomTuple = [];

  constructor() { }

  set(key: KeyT, value: ValueT): void {
    const idx = this._hashFn(key);
    // Delay initialization of buckets to save memory.
    if (!this._buckets[idx]) {
      this._buckets[idx] = [];
    }
    const bucket = this._buckets[idx];

    for (let entry of bucket) {
      if (entry.key === key) {
        // Update entry.
        entry.value = value;
        return;
      }
    }

    bucket.push({ key, value });
    // If we were resizing, this would be a good place to update metadata and decide if resize is needed.
  }

  has(key: KeyT): boolean {
    return !!this._getEntry(key);
  }

  get(key: KeyT): ValueT {
    const entry = this._getEntry(key);
    if (entry.key === key) {
      return entry.value;
    }
    throw new Error(`Cannot delete get "${key}", it cannot not be found in HashMap.`);
  }

  delete(key: KeyT): void {
    const bucket = this._getBucket(key);
    for (let idx = 0; idx < bucket.length; idx++) {
      if (bucket[idx].key === key) {
        bucket.splice(idx, 1);
        return
      }
    }
    throw new Error(`Cannot delete key "${key}", it cannot not be found in HashMap.`);
  }

  private _getEntry(key: KeyT): HashEntry<KeyT, ValueT> | null {
    const bucket = this._getBucket(key);
    for (let entry of bucket) {
      if (entry.key === key) {
        return entry;
      }
    }
    return null;
  }

  private _getBucket(key: KeyT): Array<HashEntry<KeyT, ValueT>> {
    return this._buckets[this._hashFn(key)] || [];
  }

  // Universal hashing function as described in Introduction to Algorithms (2005 MIT).
  // See https://youtu.be/s7QSM_hlS1U?t=24m51s proof.
  // The general idea is that we are
  // - decompose the key into a tuple of digits using this._size as a base
  // - multiplying those digits by a random number in the same base
  // - reduce them using modulus
  // Random tuple is generated lazily, and this._size must be a prime.
  private _hashFn(key: KeyT): number {
    if (typeof key !== 'string') {
      throw new Error('Only string keys are supported.');
    }
    const keyTuple = this._stringToTuple(key);
    const randomTuple = this._getRandomTuple(key.length);
    const dotProduct = keyTuple.map((value, idx) => value * randomTuple[idx]);
    const hash = dotProduct.reduce((carry, curr) => ((carry + curr) % this._size), 0);
    return hash;
  }

  // Convert string into base this._size tuple, supporting unicode.
  // Treats the code point array as being a series of digits and converts the base.
  private _stringToTuple(string: string) {
    const codePoints = Array.from(string).map(singleCharStr => singleCharStr.charCodeAt(0));
    let carry = 0;
    const tuple = [];
    for (let idx = 0; idx < codePoints.length || carry > 0; idx++) {
      const currNumber = codePoints[idx] + carry;
      const remainder = currNumber % this._size;
      const quotient = Math.trunc(currNumber / this._size);
      carry = quotient;
      tuple.push(remainder);
    }
    return tuple;
  }

  // Lazy generated random tuple between 0 and this.size -1.
  // For use in _hashFn.
  private _getRandomTuple(length: number) {
    const missingTuples = length - this._randomTuple.length;
    for (let i = 0; i < missingTuples; i++) {
      this._randomTuple.push(Math.floor(Math.random() * Math.floor(this._size - 1)));
    }
    return this._randomTuple;
  }
}

// Tests
const stringHashMap = new HashMap<string, string>();
const key1 = 'key1';
const val1 = 'val1';
const key2 = 'key2';
const val2 = 'val2';

expect(stringHashMap.has(key1), false);
expect(stringHashMap.has(key2), false);

stringHashMap.set(key1, val1);
stringHashMap.set(key2, val2);
expect(stringHashMap.has(key1), true);
expect(stringHashMap.has(key2), true);
expect(stringHashMap.get(key1), val1);
expect(stringHashMap.get(key2), val2);

stringHashMap.delete(key1);
expect(stringHashMap.has(key1), false);
expect(stringHashMap.has(key2), true);
