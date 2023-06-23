"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _colorette = _interopRequireDefault(require("colorette"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
    super(_colorette.default.yellowBright(message));
    Object.defineProperties(this, {
      name: {
        value: _colorette.default.redBright(`WumpStorageError[${options?.name ?? 'UnknownError'}]`),
        writable: false,
        configurable: false
      },
      stack: {
        value: options?.stack ?? this.stack,
        writable: false,
        configurable: false
      }
    });
  }
  /**
   * Throw error.
   */
  throw() {
    throw this;
  }
}
;
class StorageError extends DefaultError {}
exports.default = StorageError;
;
