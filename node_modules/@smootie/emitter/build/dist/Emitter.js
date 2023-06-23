"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("@wumpjs/storage"));
var _nodeEvents = _interopRequireDefault(require("node:events"));
var _EmitterError = _interopRequireDefault(require("./EmitterError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _options = /*#__PURE__*/new WeakMap();
var KiwiEmitter = /*#__PURE__*/function () {
  /**
   * @param {{ listenerLimit?: number, includeRejections?: boolean }} options
   * @constructor
   */
  function KiwiEmitter(options) {
    var _options2,
      _options3,
      _options4,
      _options5,
      _options6,
      _this = this;
    _classCallCheck(this, KiwiEmitter);
    _classPrivateFieldInitSpec(this, _options, {
      writable: true,
      value: {
        listenerLimit: _nodeEvents["default"].defaultMaxListeners,
        includeRejections: false
      }
    });
    /**
     * @type Storage<((...args: any[]) => unknown)[], string>
     * @readonly
     */
    _defineProperty(this, "events", new _storage["default"]());
    /**
     * @type Storage<string, string>
     * @private
     */
    _defineProperty(this, "timeouts", new _storage["default"]());
    if (_typeof(options) !== "object") options = {};
    if ((_options2 = options) !== null && _options2 !== void 0 && _options2.includeRejections && typeof ((_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.includeRejections) !== "boolean") new _EmitterError["default"]("'".concat(options.includeRejections, "' is not Boolean."), {
      name: "TypeError"
    })["throw"]();
    if ((_options4 = options) !== null && _options4 !== void 0 && _options4.listenerLimit && typeof ((_options5 = options) === null || _options5 === void 0 ? void 0 : _options5.listenerLimit) !== "number") new _EmitterError["default"]("'".concat(options.listenerLimit, "' is not Number."), {
      name: "TypeError"
    })["throw"]();
    if ((_options6 = options) !== null && _options6 !== void 0 && _options6.includeRejections) {
      this.on("processError", console.error);
      process.on("unhandledRejection", function (reason) {
        return _this.emit("processError", reason);
      });
      process.on("uncaughtException", function (reason) {
        return _this.emit("processError", reason);
      });
    }
    ;
    this.once("__memoryLeak", function () {
      return process.emitWarning("Possible KiwiEmitter memory leak detected. ".concat(options.listenerCount, " listeners added to [KiwiEmitter]."), {
        detail: "Use 'listenerLimit' option to increase limit",
        code: "MaxListenersExceededWarning"
      });
    });
    _classPrivateFieldSet(this, _options, options);
  }
  _createClass(KiwiEmitter, [{
    key: "listenerCount",
    get:
    /**
     * Get listener count.
     * @returns {number}
     */
    function get() {
      return this.events.size;
    }
  }, {
    key: "listenerLimit",
    get:
    /**
     * Get listener limit.
     * @returns {number}
     */
    function get() {
      return _classPrivateFieldGet(this, _options).listenerLimit;
    }
  }, {
    key: "setLimit",
    value:
    /**
     * Set limit of events.
     * @param {number} limit 
     * @returns {this}
     */
    function setLimit(limit) {
      if (typeof limit !== "number") new _EmitterError["default"]("'".concat(limit, "' is not Number."), {
        name: "TypeError"
      })["throw"]();
      _classPrivateFieldGet(this, _options).listenerCount = limit;
      return this;
    }
  }, {
    key: "on",
    value:
    /**
     * Run event forever.
     * @param {string} name 
     * @param {(...args: any[]) => unknown} fncallback 
     * @returns {this}
     */
    function on(name, fncallback) {
      if (this.listenerCount >= this.listenerLimit) this.emit("__memoryLeak", 0);
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (typeof fncallback !== "function") new _EmitterError["default"]("'".concat(fncallback, "' is not Function."), {
        name: "TypeError"
      })["throw"]();
      if (!this.has(name)) this.events.set(name, []);
      var events = this.events.get(name);
      events.push({
        name: name,
        listener: fncallback,
        once: false
      });
      return this;
    }
  }, {
    key: "once",
    value:
    /**
     * Run event for only once.
     * @param {string} name 
     * @param {(...args: any[]) => unknown} fncallback 
     * @returns {this}
     */
    function once(name, fncallback) {
      var _this2 = this;
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (typeof fncallback !== "function") new _EmitterError["default"]("'".concat(fncallback, "' is not Function."), {
        name: "TypeError"
      })["throw"]();
      var off = function off(name, __cb) {
        return _this2.off(name, __cb);
      };
      this.on(name, function __cb() {
        fncallback.apply(void 0, arguments);
        off(name, __cb);
      });
      return this;
    }
  }, {
    key: "off",
    value:
    /**
     * Disable event.
     * @param {string} name 
     * @param {(...args: any[]) => unknown} fncallback 
     * @returns {this}
     */
    function off(name, fncallback) {
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (typeof fncallback !== "function") new _EmitterError["default"]("'".concat(fncallback, "' is not Function."), {
        name: "TypeError"
      })["throw"]();
      if (!this.events.has(name)) return this;
      var __filtered = this.events.filter(function (event) {
        return event.some(function (e) {
          return e.listener === fncallback;
        });
      });
      var _iterator = _createForOfIteratorHelper(__filtered),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            eventName = _step$value[0],
            event = _step$value[1];
          this.remove(eventName);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return this;
    }
  }, {
    key: "emit",
    value:
    /**
     * Run event.
     * @param {string} name 
     * @param  {...any} args 
     * @returns {void}
     */
    function emit(name) {
      var _this$events$get;
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (this.timeouts.has(name)) return null;
      var events = (_this$events$get = this.events.get(name)) !== null && _this$events$get !== void 0 ? _this$events$get : [];
      if (!Array.isArray(events)) events = [];
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var _iterator2 = _createForOfIteratorHelper(events),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var event = _step2.value;
          if (!(event !== null && event !== void 0 && event.name)) break;
          event.emitted = true;
          event.listener.apply(event, args);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      ;
      return void 0;
    }
  }, {
    key: "has",
    value:
    /**
     * Check event.
     * @param {string} name 
     * @returns {boolean}
     */
    function has(name) {
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      return this.events.has(name);
    }
  }, {
    key: "remove",
    value:
    /**
     * Remove event.
     * @param {string} name 
     * @returns {{ name?: string, state?: "Deleted" | "NotDeleted" }[]}
     */
    function remove(name) {
      var _this$events$get2;
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      var events = (_this$events$get2 = this.events.get(name)) !== null && _this$events$get2 !== void 0 ? _this$events$get2 : [];
      var result = [];
      var _iterator3 = _createForOfIteratorHelper(events),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var event = _step3.value;
          if (!(event !== null && event !== void 0 && event.name)) break;
          this.events["delete"](event.name);
          if (this.has(event.name)) result.push({
            name: event.name,
            state: "NotDeleted"
          });else result.push({
            name: event.name,
            state: "Deleted"
          });
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      ;
      return result;
    }
  }, {
    key: "emitted",
    value:
    /**
     * Checks event is emitted.
     * @param {string} name 
     * @returns {boolean}
     */
    function emitted(name) {
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (!this.has(name)) return false;
      var __emitted = false;
      var events = this.events.get(name);
      var _iterator4 = _createForOfIteratorHelper(events),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var event = _step4.value;
          if (event !== null && event !== void 0 && event.emitted) __emitted = true;else break;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      ;
      return __emitted;
    }
  }, {
    key: "add",
    value:
    /**
     * Add event.
     * @param {...({ name: string, listener: (...args: any[]) => unknown, once?: boolean })} events 
     * @returns {void}
     */
    function add() {
      for (var _len2 = arguments.length, events = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        events[_key2] = arguments[_key2];
      }
      if (events.length > 10) new _EmitterError["default"]("With the 'add' function, a maximum of 10 events can be added in one use.", {
        name: "RangeError"
      })["throw"]();
      for (var _i2 = 0, _events = events; _i2 < _events.length; _i2++) {
        var event = _events[_i2];
        if (!(event !== null && event !== void 0 && event.name)) break;
        if (!(event !== null && event !== void 0 && event.listener)) break;
        if (event !== null && event !== void 0 && event.listener && typeof (event === null || event === void 0 ? void 0 : event.listener) !== "function") break;
        this[event !== null && event !== void 0 && event.once ? "once" : "on"](event.name, event.listener);
      }
      ;
      return void 0;
    }
  }, {
    key: "suspendListener",
    value: function suspendListener(name, time) {
      var _this3 = this;
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (typeof time !== "numvwe") new _EmitterError["default"]("'".concat(time, "' is not Number."), {
        name: "TypeError"
      })["throw"]();
      if (!this.has(name)) new _EmitterError["default"]("'".concat(name, "' is not available."), {
        name: "InvalidEvent"
      })["throw"]();
      this.timeouts.set(name, ms);
      setTimeout(function () {
        return _this3.timeouts["delete"](name);
      }, time);
      return void 0;
    }
  }, {
    key: "unsuspendListener",
    value: function unsuspendListener(name) {
      if (typeof name !== "string") new _EmitterError["default"]("'".concat(name, "' is not String."), {
        name: "TypeError"
      })["throw"]();
      if (!this.timeouts.has(name)) return;
      this.timeouts["delete"](name);
      return void 0;
    }
  }]);
  return KiwiEmitter;
}();
exports["default"] = KiwiEmitter;
;