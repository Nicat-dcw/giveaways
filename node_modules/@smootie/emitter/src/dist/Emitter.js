import Storage from "@wumpjs/storage"
import EventEmitter from "node:events";

import EmitterError from "./EmitterError.js";

export default class KiwiEmitter {
  /**
   * @param {{ listenerLimit?: number, includeRejections?: boolean }} options
   * @constructor
   */
  constructor(options) {
    if (typeof options !== "object") options = {};

    if (options?.includeRejections && typeof options?.includeRejections !== "boolean") (new EmitterError(`'${options.includeRejections}' is not Boolean.`, { name: "TypeError" })).throw();
    if (options?.listenerLimit && typeof options?.listenerLimit !== "number") (new EmitterError(`'${options.listenerLimit}' is not Number.`, { name: "TypeError" })).throw();

    if (options?.includeRejections) {
      this.on("processError", console.error);

      process.on("unhandledRejection", (reason) => this.emit("processError", reason));
      process.on("uncaughtException", (reason) => this.emit("processError", reason));
    };

    this.once("__memoryLeak", () => process.emitWarning(`Possible KiwiEmitter memory leak detected. ${options.listenerCount} listeners added to [KiwiEmitter].`, {
      detail: `Use 'listenerLimit' option to increase limit`,
      code: "MaxListenersExceededWarning"
    }));

    this.#options = options;
  };

  #options = {
    listenerLimit: EventEmitter.defaultMaxListeners,
    includeRejections: false
  };

  /**
   * @type Storage<((...args: any[]) => unknown)[], string>
   * @readonly
   */
  events = new Storage();

  /**
   * @type Storage<string, string>
   * @private
   */
  timeouts = new Storage();
  
  /**
   * Get listener count.
   * @returns {number}
   */
  get listenerCount() {
    return this.events.size;
  };

  /**
   * Get listener limit.
   * @returns {number}
   */
  get listenerLimit() {
    return this.#options.listenerLimit;
  };

  /**
   * Set limit of events.
   * @param {number} limit 
   * @returns {this}
   */
  setLimit(limit) {
    if (typeof limit !== "number") (new EmitterError(`'${limit}' is not Number.`, { name: "TypeError" })).throw();

    this.#options.listenerCount = limit;

    return this;
  };

  /**
   * Run event forever.
   * @param {string} name 
   * @param {(...args: any[]) => unknown} fncallback 
   * @returns {this}
   */
  on(name, fncallback) {
    if (this.listenerCount >= this.listenerLimit) this.emit("__memoryLeak", 0);

    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();
    if (typeof fncallback !== "function") (new EmitterError(`'${fncallback}' is not Function.`, { name: "TypeError" })).throw();

    if (!this.has(name)) this.events.set(name, []);
    const events = this.events.get(name);
    events.push({ name, listener: fncallback, once: false });

    return this;
  };

  /**
   * Run event for only once.
   * @param {string} name 
   * @param {(...args: any[]) => unknown} fncallback 
   * @returns {this}
   */
  once(name, fncallback) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();
    if (typeof fncallback !== "function") (new EmitterError(`'${fncallback}' is not Function.`, { name: "TypeError" })).throw();

    const off = (name, __cb) => this.off(name, __cb);
    this.on(name, function __cb(...args) {
      fncallback(...args);
      off(name, __cb);
    });

    return this;
  };

  /**
   * Disable event.
   * @param {string} name 
   * @param {(...args: any[]) => unknown} fncallback 
   * @returns {this}
   */
  off(name, fncallback) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();
    if (typeof fncallback !== "function") (new EmitterError(`'${fncallback}' is not Function.`, { name: "TypeError" })).throw();

    if (!this.events.has(name)) return this;

    const __filtered = this.events.filter((event) => event.some((e) => e.listener === fncallback));
    for (const [eventName, event] of __filtered) this.remove(eventName);

    return this;
  };

  /**
   * Run event.
   * @param {string} name 
   * @param  {...any} args 
   * @returns {void}
   */
  emit(name, ...args) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();

    if (this.timeouts.has(name)) return null;

    let events = this.events.get(name) ?? [];
    if (!Array.isArray(events)) events = [];
    for (const event of events) {
      if (!event?.name) break;

      event.emitted = true;
      event.listener(...args);
    };

    return void 0;
  };

  /**
   * Check event.
   * @param {string} name 
   * @returns {boolean}
   */
  has(name) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();

    return (this.events.has(name));
  };

  /**
   * Remove event.
   * @param {string} name 
   * @returns {{ name?: string, state?: "Deleted" | "NotDeleted" }[]}
   */
  remove(name) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();

    const events = this.events.get(name) ?? [];

    const result = [];
    for (const event of events) {
      if (!event?.name) break;

      this.events.delete(event.name);

      if (this.has(event.name)) result.push({ name: event.name, state: "NotDeleted" });
      else result.push({ name: event.name, state: "Deleted" });
    };

    return result;
  };

  /**
   * Checks event is emitted.
   * @param {string} name 
   * @returns {boolean}
   */
  emitted(name) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();
    if (!this.has(name)) return false;

    let __emitted = false;

    const events = this.events.get(name);
    for (const event of events) {
      if (event?.emitted) __emitted = true;
      else break;
    };

    return __emitted;
  };

  /**
   * Add event.
   * @param {...({ name: string, listener: (...args: any[]) => unknown, once?: boolean })} events 
   * @returns {void}
   */
  add(...events) {
    if (events.length > 10) (new EmitterError(`With the 'add' function, a maximum of 10 events can be added in one use.`, { name: "RangeError" })).throw();

    for (const event of events) {
      if (!event?.name) break;
      if (!event?.listener) break;

      if (event?.listener && typeof event?.listener !== "function") break;

      this[event?.once ? "once" : "on"](event.name, event.listener);
    };

    return void 0;
  };

  suspendListener(name, time) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();
    if (typeof time !== "numvwe") (new EmitterError(`'${time}' is not Number.`, { name: "TypeError" })).throw();

    if (!this.has(name)) (new EmitterError(`'${name}' is not available.`, { name: "InvalidEvent" })).throw();

    this.timeouts.set(name, ms);
    setTimeout(() => this.timeouts.delete(name), time);

    return void 0;
  };

  unsuspendListener(name) {
    if (typeof name !== "string") (new EmitterError(`'${name}' is not String.`, { name: "TypeError" })).throw();

    if (!this.timeouts.has(name)) return;

    this.timeouts.delete(name);

    
    return void 0;
  };
};