import chalk from "chalk";

/**
 * @abstract
 */
class DefaultError extends Error {
  /**
   * Create new Error instance.
   * @param {string} message 
   * @param {{ name?: string, stack?: string }} options
   * @constructor
   */
  constructor(message, options) {
    super(chalk.yellowBright(message));

    Object.defineProperties(this, {
      name: {
        value: chalk.redBright(`WumpStorageError[${options?.name ?? 'UnknownError'}]`),
        writable: false,
        configurable: false
      },

      stack: {
        value: options?.stack ?? this.stack,
        writable: false,
        configurable: false
      }
    });
  };

  /**
   * Throw error.
   */
  throw() {
    throw this;
  };
};

export default class StorageError extends DefaultError {};