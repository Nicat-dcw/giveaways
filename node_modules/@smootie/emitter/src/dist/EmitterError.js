import { redBright, yellowBright } from "colorette";

/**
 * @abstract
 */
class DefaultError extends Error {
  /**
   * Create new error.
   * @param {string} message 
   * @param {{ name?: string, stack?: string }} options 
   */
  constructor(message, options) {
    super(yellowBright(message));
    Object.defineProperty(this, "name", {
      value: redBright(`KiwiError[${typeof options?.name === "string" ? options.name : "UnknownError"}]`),
      configurable: false,
      writable: false
    })

    if (options?.stack) this.stack = options.stack;
  };

  throw() {
    throw this;
  };
};

export default class EmitterError extends DefaultError {
  constructor(message, options) {
    super(message, options);
  };
};