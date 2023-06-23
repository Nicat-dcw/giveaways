"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeUtil = require("node:util");
var _StorageError = _interopRequireDefault(require("./StorageError.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Storage extends Map {
  /**
   * Create new temp-based storage.
   * @param {{ size?: number }} options
   * @constructor
   */
  constructor(options) {
    if (typeof options !== "object") options = {};
    super();
    if (options?.size && typeof options?.size !== "number") new _StorageError.default(`'${size}' is not Number.`, {
      name: "TypeError"
    }).throw();
    if (!options?.size || options?.size < 0) options.size = 0;

    /**
     * Storage options.
     */
    Object.defineProperty(this, "options", {
      value: options,
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, "_deleteSet", {
      value: (key, newKey, value) => {
        this.delete(key);
        this.set(newKey, value);
      },
      enumerable: false,
      configurable: false,
      writable: false
    });
  }
  get lastKey() {
    return this.keyAt(this.size - 1);
  }
  get firstKey() {
    return this.keyAt(0);
  }
  get lastValue() {
    return this.valueAt(this.size - 1);
  }
  get firstValue() {
    return this.valueAt(0);
  }
  get reverse() {
    const __reserved = [];
    const entries = this.entries();
    let entry = entries.next();
    while (!entry.done) {
      __reserved.unshift(entry.value);
      entry = entries.next();
    }
    ;
    this.clear();
    for (const [key, value] of __reserved) this.set(key, value);
    return this;
  }
  /**
   * Clone this Storage.
   * @returns {Storage}
   */
  get clone() {
    const __constructor = new this.constructor[Symbol.species]({
      size: this.options.size
    });
    for (const [key, value] of this) __constructor.set(key, value);
    return __constructor;
  }
  get json() {
    const values = [...this.values()];
    const keys = [...this.keys()];
    return {
      keys,
      values
    };
  }
  set(key, value) {
    if (this.options.size !== 0 && this.options.size < this.size) new _StorageError.default(`Storage limit exceeded.`, {
      name: "RangeError"
    }).throw();
    super.set(key, value);
    return this;
  }
  getMultiple(...keys) {
    const values = [];
    for (const key of keys) {
      if (typeof key !== "string") new _StorageError.default(`'${key}' is not String.`, {
        name: "TypeError"
      }).throw();
      if (!this.has(key)) break;
      values.unshift(this.get(key));
    }
    ;
    return values;
  }
  replaceValue(key, newValue) {
    const __data = this.filter((value, __key) => key === __key);
    __data.map((value, __key) => this.set(__key, newValue));
    return void 0;
  }
  replaceKey(value, newKey) {
    const __data = this.filter(__value => value === __value);
    __data.map((__value, key) => this._deleteSet(key, newKey, __value));
    return void 0;
  }
  /**
   * @param  {...({ key: any, replaceWith?: any })} org
   * @returns {void}
   */
  replaceAllValues(...org) {
    for (const object of org) this.replaceValue(object?.key, object?.replaceWith);
    return void 0;
  }
  /**
   * @param  {...({ value: any, replaceWith?: any })} org
   * @returns {void}
   */
  replaceAllKeys(...org) {
    for (const object of org) this.replaceKey(object?.value, object?.replaceWith);
    return void 0;
  }
  hasAny(...datas) {
    for (const data of datas) {
      const __values = this.some(value => value === data);
      return __values;
    }
    ;
  }
  hasEvery(...datas) {
    for (const data of datas) {
      const __values = this.every(value => value === data);
      return __values;
    }
    ;
  }
  ensure(key, callback) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (this.has(key)) return this.get(key);
    const value = callback(key, this);
    this.set(key, value);
    return value;
  }
  findAny(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    let __results = [];
    for (const [key, value] of this) if (callback(value, key, this)) __results.push({
      key,
      value
    });
    return __results;
  }
  findValue(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) if (callback(value, key, this)) return value;
    return void 0;
  }
  findKey(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) if (callback(value, key, this)) return key;
    return void 0;
  }
  filter(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);

    /**
     * @type {Storage}
     */
    const results = new this.constructor[Symbol.species]({
      size: this.options.size
    });
    for (const [key, value] of this) if (callback(value, key, this)) results.set(key, value);
    return results;
  }
  filterAndSave(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) if (callback(value, key, this)) this.set(key, value);
    return this;
  }
  /**
   * @deprecated Please use 'each' instead.
   * @private
   */
  forEach(callback) {
    if (typeof callback !== "function") callback = () => {};
    (0, _nodeUtil.deprecate)(() => {}, `'forEach' is deprecated. Please use 'each' instead.`, "MovedFunction")();
    super.forEach(callback);
    return this;
  }
  each(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) callback(value, key, this);
    return this;
  }
  map(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    const entries = this.entries();

    /**
     * @type {Storage}
     */
    const __constructor = new this.constructor[Symbol.species]({
      size: this.options.size
    });
    let index = 0;
    for (const [key, value] of entries) {
      const __value = callback(value, key, index, this);
      index++;
      __constructor.set(key, __value);
    }
    ;
    return __constructor;
  }
  flatMap(callback, thisArg) {
    const __data = this.map(callback, thisArg);
    /**
     * @type {this}
     */
    const __constructor = new this.constructor[Symbol.species]();
    return __constructor.concat(__data);
  }
  randomValue(count) {
    if (typeof count !== "number") new _StorageError.default(`'${count}' is not a number.`, {
      name: "TypeError"
    }).throw();
    const values = this.values();
    let entries = [];
    for (let value of values) entries.push(value);
    if (count !== undefined) return entries[Math.floor(Math.random() * entries.length)];
    if (entries.length < 1 || count < 1) return [];
    const __data = [];
    const length = Math.min(count, entries.length);
    for (let i = 0; i < length; i++) {
      const randomIndex = Storage.random({
        max: entries.length
      });
      const randomValue = entries.splice(randomIndex, 1)[0];
      __data.push(randomValue);
    }
    ;
    return __data;
  }
  randomKey(count) {
    if (typeof count !== "number") new _StorageError.default(`'${count}' is not a number.`, {
      name: "TypeError"
    }).throw();
    const keys = this.keys();
    let entries = [];
    for (let key of keys) entries.push(key);
    if (count !== undefined) return entries[Math.floor(Math.random() * entries.length)];
    if (entries.length < 1 || count < 1) return [];
    const __data = [];
    const length = Math.min(count, entries.length);
    for (let i = 0; i < length; i++) {
      const randomIndex = Storage.random({
        max: entries.length
      });
      const randomKey = entries.splice(randomIndex, 1)[0];
      __data.push(randomKey);
    }
    ;
    return __data;
  }
  valueAt(index) {
    if (typeof index !== "number") new _StorageError.default(`'${index}' is not a number.`, {
      name: "TypeError"
    }).throw();
    index = Math.floor(index);
    let __index = 0;
    for (let value of this.values()) {
      if (__index === index) return value;
      __index++;
    }
    ;
    return undefined;
  }
  keyAt(index) {
    if (typeof index !== "number") new _StorageError.default(`'${index}' is not a number.`, {
      name: "TypeError"
    }).throw();
    index = Math.floor(index);
    let __index = 0;
    for (let key of this.keys()) {
      if (__index === index) return key;
      __index++;
    }
    ;
    return undefined;
  }
  some(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) if (callback(value, key, this)) return true;
    return false;
  }
  every(callback, thisArg) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not Function.`, {
      name: "TypeError"
    }).throw();
    if (thisArg !== undefined) callback = callback.bind(thisArg);
    for (const [key, value] of this) if (!callback(value, key, this)) return false;
    return true;
  }
  sort(callback = Storage.sort) {
    if (typeof callback !== "function") new _StorageError.default(`'${callback}' is not a function.`, {
      name: "TypeError"
    }).throw();
    const entries = [];
    for (let [key, value] of this.entries()) entries.push([key, value]);
    entries.sort((a, b) => callback(a[1], b[1], a[0], b[0]));
    this.clear();
    for (let [key, value] of entries) this.set(key, value);
    return this;
  }
  concat(...storages) {
    const __storage = this.clone();
    for (const storage of storages) {
      for (const [key, value] of storage) __storage.set(key, value);
    }
    ;
    return __storage;
  }
  equals(storage) {
    if (this === storage) return true;
    if (this.size !== storage.size) return false;
    for (const [key, value] of this) if (!storage.has(key) || value !== storage.get(key)) return false;
    return true;
  }
  subtract(storage) {
    if (!(storage instanceof this)) new _StorageError.default(`'${storage}' is not Storage instance.`, {
      name: "TypeError"
    }).throw();

    /**
     * @type {this}
     */
    const __storage = new this.constructor[Symbol.species]();
    for (const [key, value] of storage) if (!storage.has(key) && !Object.is(value, storage.get(key))) __storage.set(key, value);
    return __storage;
  }
  crop(storage) {
    if (!(storage instanceof this)) new _StorageError.default(`'${storage}' is not Storage instance.`, {
      name: "TypeError"
    }).throw();

    /**
     * @type {this}
     */
    const __storage = new this.constructor[Symbol.species]();
    for (const [key, value] of storage) if (this.has(key) && Object.is(value, this.get(key))) __storage.set(key, value);
    return __storage;
  }
  /**
   * Generate random number.
   * @param {{ min?: number, max?: number }} options 
   * @returns {number}
   */
  static random(options) {
    let {
      max,
      min
    } = options;
    min ??= 0;
    if (options?.min && typeof options?.min !== "number" || options?.max && typeof options?.max !== "number") new _StorageError.default(`'${min}' or '${max}' is not Number. `, {
      name: "TypeError"
    }).throw();
    if (min >= max) new _StorageError.default(`'${max}' must be greater than '${min}'. `, {
      name: "RangeError"
    }).throw();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static sort(f, s) {
    const __sort = Number(f > s) || Number(f === s);
    return __sort;
  }
  static combine(entries, combine) {
    const storage = new this();
    for (const [key, value] of entries) if (storage.has(key)) storage.set(key, combine(storage.get(key), value, key));else storage.set(key, value);
    return storage;
  }
}
exports.default = Storage;
;
