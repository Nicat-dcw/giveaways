"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StorageError = void 0;
var _Storage = _interopRequireDefault(require("./dist/Storage.cjs"));
var _StorageError = _interopRequireDefault(require("./dist/StorageError.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const StorageError = _StorageError.default;
exports.StorageError = StorageError;
var _default = _Storage.default;
exports.default = _default;
