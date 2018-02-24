import { expect } from './expect';


// Implementation
interface HashEntry<KeyT, ValueT> {
  key: KeyT;
  value: ValueT;
}

class HashMap<KeyT, ValueT> {
  // Does not resize.
  private _size = 100;
  private _buckets = new Array<HashEntry<KeyT, ValueT>[]>(this._size);

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

  private _hashFn(key: KeyT): number {
    // Can only hash string keys.
    const stringKey = key as any as string;
    let hash = 0;
    for (let idx = 0; idx < stringKey.length; idx++) {
      hash = (hash + stringKey.charCodeAt(idx)) % this._size;
    }
    return hash;
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

