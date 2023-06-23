declare module "@wumpjs/storage" {
  export default class Storage<K = string, V = unknown> extends Map<K, V>{
    /**
     * Create new temp-based storage.
     */
    public constructor(options: StorageOptions);

    /**
     * Storage options.
     */
    public readonly options: StorageOptions;

    /**
     * Get last key of Storage.
     */
    public lastKey: K;
    /**
     * Get first key of Storage.
     */
    public firstKey: K;
    /**
     * Get last value of Storage.
     */
    public lastValue: V;
    /**
     * Get first value of Storage.
     */
    public firstValue: V;
    /**
     * JSON Results of Storage.
     */
    public json: { keys: K[], values: V[] };
    /**
     * Reverses Storage.
     */
    public reverse: this;
    /**
     * Clone storage.
     */
    public clone: Storage<K, V>;
    
    /**
     * The crop method returns a new structure containing items where the keys and values are present in both original structures.
     */
    public crop(storage: this): this;
    static combine(entries: object, combine: (storageValue: V, value: V, key: K) => boolean): this;
    public concat(...storages: this[]): this;
    public equals(storage: this): boolean;
    public each(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): this;
    public ensure(key: K, callback: (value: V, key: K, Storage: this) => V): V;
    public every(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): boolean;
    public findValue(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): V;
    public findAny(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): { key: K, value: V }[];
    public findValue(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): V[keyof V];
    public findKey(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): K;
    public flatMap(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): this;
    public filter(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): this;
    public filterAndSave(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): this;
    private forEach(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): this;
    public getMultiple(...keys: K[]): V[];
    public hasAny(...datas: V[]): boolean;
    public hasEvery(...datas: V[]): boolean;
    public keyAt(index: number): K;
    public map(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): V[];
    public map(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): V[keyof V][];
    public map(callback: (value: V, key: K, Storage: this) => any, thisArg?: this): V[keyof V][];
    public map(callback: (value: V, key: K, Storage: this) => any, thisArg?: this): V[];
    public randomValue(count: number): V;
    public randomKey(count: number): K;
    public random(options: { min?: number, max?: number }): number
    public replaceKey(value: V, newKey: K): this
    public replaceValue(key: K, newValue: V): this
    public replaceAllKeys(...org: { value: V, replaceWith: K }[]): this
    public replaceAllValues(...org: { key: K, replaceWith: V}[]): this
    public sort(callback: (f: K, s: V) => boolean): this;
    public set(name: K, value: V): this;
    public subtract(storage: this): this;
    public some(callback: (value: V, key: K, Storage: this) => boolean, thisArg?: this): boolean;
    public valueAt(index: number): V;
  }

  export interface StorageOptions {
    size?: number;
  }
}