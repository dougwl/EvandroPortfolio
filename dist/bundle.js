/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8135:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(6253);
__webpack_require__(9115);
__webpack_require__(1181);
__webpack_require__(851);
__webpack_require__(9865);
__webpack_require__(1898);
module.exports = __webpack_require__(5645).Promise;


/***/ }),

/***/ 4963:
/***/ ((module) => {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 7722:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(6314)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(7728)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 3328:
/***/ ((module) => {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ 7007:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(5286);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 9315:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(2110);
var toLength = __webpack_require__(875);
var toAbsoluteIndex = __webpack_require__(2337);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 1488:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(2032);
var TAG = __webpack_require__(6314)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ 2032:
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 5645:
/***/ ((module) => {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 741:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// optional / simple context binding
var aFunction = __webpack_require__(4963);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 1355:
/***/ ((module) => {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 7057:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(4253)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 2457:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(5286);
var document = __webpack_require__(3816).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 4430:
/***/ ((module) => {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 2985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(3816);
var core = __webpack_require__(5645);
var hide = __webpack_require__(7728);
var redefine = __webpack_require__(7234);
var ctx = __webpack_require__(741);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 4253:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 3531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(741);
var call = __webpack_require__(8851);
var isArrayIter = __webpack_require__(6555);
var anObject = __webpack_require__(7007);
var toLength = __webpack_require__(875);
var getIterFn = __webpack_require__(9002);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ 18:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(3825)('native-function-to-string', Function.toString);


/***/ }),

/***/ 3816:
/***/ ((module) => {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 9181:
/***/ ((module) => {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 7728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(9275);
var createDesc = __webpack_require__(681);
module.exports = __webpack_require__(7057) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 639:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var document = __webpack_require__(3816).document;
module.exports = document && document.documentElement;


/***/ }),

/***/ 1734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = !__webpack_require__(7057) && !__webpack_require__(4253)(function () {
  return Object.defineProperty(__webpack_require__(2457)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 7242:
/***/ ((module) => {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ 9797:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(2032);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 6555:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// check on default Array iterator
var Iterators = __webpack_require__(2803);
var ITERATOR = __webpack_require__(6314)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ 5286:
/***/ ((module) => {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 8851:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(7007);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ 9988:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var create = __webpack_require__(2503);
var descriptor = __webpack_require__(681);
var setToStringTag = __webpack_require__(2943);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7728)(IteratorPrototype, __webpack_require__(6314)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ 2923:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(4461);
var $export = __webpack_require__(2985);
var redefine = __webpack_require__(7234);
var hide = __webpack_require__(7728);
var Iterators = __webpack_require__(2803);
var $iterCreate = __webpack_require__(9988);
var setToStringTag = __webpack_require__(2943);
var getPrototypeOf = __webpack_require__(468);
var ITERATOR = __webpack_require__(6314)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ 7462:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ITERATOR = __webpack_require__(6314)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ 5436:
/***/ ((module) => {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ 2803:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 4461:
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ 4351:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(3816);
var macrotask = __webpack_require__(4193).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(2032)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ 3499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(4963);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 2503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(7007);
var dPs = __webpack_require__(5588);
var enumBugKeys = __webpack_require__(4430);
var IE_PROTO = __webpack_require__(9335)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(2457)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(639).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ 9275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var anObject = __webpack_require__(7007);
var IE8_DOM_DEFINE = __webpack_require__(1734);
var toPrimitive = __webpack_require__(1689);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7057) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 5588:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(9275);
var anObject = __webpack_require__(7007);
var getKeys = __webpack_require__(7184);

module.exports = __webpack_require__(7057) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ 468:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(9181);
var toObject = __webpack_require__(508);
var IE_PROTO = __webpack_require__(9335)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ 189:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(9181);
var toIObject = __webpack_require__(2110);
var arrayIndexOf = __webpack_require__(9315)(false);
var IE_PROTO = __webpack_require__(9335)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 7184:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(189);
var enumBugKeys = __webpack_require__(4430);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 188:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ 94:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(7007);
var isObject = __webpack_require__(5286);
var newPromiseCapability = __webpack_require__(3499);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 681:
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 4408:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var redefine = __webpack_require__(7234);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ 7234:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(3816);
var hide = __webpack_require__(7728);
var has = __webpack_require__(9181);
var SRC = __webpack_require__(3953)('src');
var $toString = __webpack_require__(18);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(5645).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ 2974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(3816);
var dP = __webpack_require__(9275);
var DESCRIPTORS = __webpack_require__(7057);
var SPECIES = __webpack_require__(6314)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ 2943:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var def = __webpack_require__(9275).f;
var has = __webpack_require__(9181);
var TAG = __webpack_require__(6314)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ 9335:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(3825)('keys');
var uid = __webpack_require__(3953);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 3825:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var core = __webpack_require__(5645);
var global = __webpack_require__(3816);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(4461) ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 8364:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(7007);
var aFunction = __webpack_require__(4963);
var SPECIES = __webpack_require__(6314)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ 4496:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(1467);
var defined = __webpack_require__(1355);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ 4193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(741);
var invoke = __webpack_require__(7242);
var html = __webpack_require__(639);
var cel = __webpack_require__(2457);
var global = __webpack_require__(3816);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(2032)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ 2337:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(1467);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 1467:
/***/ ((module) => {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 2110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(9797);
var defined = __webpack_require__(1355);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 875:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.15 ToLength
var toInteger = __webpack_require__(1467);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 508:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(1355);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 1689:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5286);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3953:
/***/ ((module) => {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 575:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(3816);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ 6314:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var store = __webpack_require__(3825)('wks');
var uid = __webpack_require__(3953);
var Symbol = __webpack_require__(3816).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ 9002:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(1488);
var ITERATOR = __webpack_require__(6314)('iterator');
var Iterators = __webpack_require__(2803);
module.exports = __webpack_require__(5645).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 6997:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var addToUnscopables = __webpack_require__(7722);
var step = __webpack_require__(5436);
var Iterators = __webpack_require__(2803);
var toIObject = __webpack_require__(2110);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(2923)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ 6253:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(1488);
var test = {};
test[__webpack_require__(6314)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(7234)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(4461);
var global = __webpack_require__(3816);
var ctx = __webpack_require__(741);
var classof = __webpack_require__(1488);
var $export = __webpack_require__(2985);
var isObject = __webpack_require__(5286);
var aFunction = __webpack_require__(4963);
var anInstance = __webpack_require__(3328);
var forOf = __webpack_require__(3531);
var speciesConstructor = __webpack_require__(8364);
var task = __webpack_require__(4193).set;
var microtask = __webpack_require__(4351)();
var newPromiseCapabilityModule = __webpack_require__(3499);
var perform = __webpack_require__(188);
var userAgent = __webpack_require__(575);
var promiseResolve = __webpack_require__(94);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(6314)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(4408)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(2943)($Promise, PROMISE);
__webpack_require__(2974)(PROMISE);
Wrapper = __webpack_require__(5645)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(7462)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ 9115:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $at = __webpack_require__(4496)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(2923)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ 9865:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(2985);
var core = __webpack_require__(5645);
var global = __webpack_require__(3816);
var speciesConstructor = __webpack_require__(8364);
var promiseResolve = __webpack_require__(94);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ 1898:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(2985);
var newPromiseCapability = __webpack_require__(3499);
var perform = __webpack_require__(188);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ 1181:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $iterators = __webpack_require__(6997);
var getKeys = __webpack_require__(7184);
var redefine = __webpack_require__(7234);
var global = __webpack_require__(3816);
var hide = __webpack_require__(7728);
var Iterators = __webpack_require__(2803);
var wks = __webpack_require__(6314);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ 666:
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ 974:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var regeneratorRuntime = __webpack_require__(666);
var ref = __webpack_require__(8135), resolve = ref.resolve;
//Some new tests
var FieldValidation = function() {
    "use strict";
    function FieldValidation() {
        _classCallCheck(this, FieldValidation);
        this.fieldsList = {
        };
        this.lastInFocus = '';
        this.displayingTooltip = false;
        this.dismissed = ''; // Indicates when pop up is dismissed.
    }
    _createClass(FieldValidation, [
        {
            /*     'use strict'; */ key: "CheckOn",
            value: function CheckOn(event, nodeObj, message, param) {
                var timeOut = param === void 0 ? 530 : param;
                var name = nodeObj.name;
                var t = timeOut;
                var msg = message;
                var instance = this;
                var ClosePopUp = function() {
                    if (document.activeElement.getAttribute('name') == name) {
                        nodeObj.blur();
                        nodeObj.focus();
                    }
                };
                var SetTimer = (function(time) {
                    var tt = time != undefined ? time : t;
                    this.fieldsList[name].status = 'on';
                    this.fieldsList[name].controller = setTimeout((function() {
                        this.IsValid(name, msg);
                    }).bind(this), tt);
                }).bind(this);
                var CloseOnOutOfFocus = function() {
                    var events = [
                        'scroll',
                        'click'
                    ];
                    var removeAfterUsed = function(evt) {
                        if (evt.type == 'scroll' || evt.type == 'click') {
                            if (name == instance.lastInFocus && instance.fieldsList[name].status == 'off') {
                                nodeObj.blur();
                                if (evt.target.tagName == 'BUTTON') {
                                    evt.preventDefault();
                                    evt.target.click();
                                }
                            } else instance.StopThis(name);
                            instance.dismissed = true;
                            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    var ev = _step.value;
                                    document.removeEventListener(ev, removeAfterUsed, true);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        }
                    };
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var event1 = _step.value;
                            document.addEventListener(event1, removeAfterUsed, true);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                };
                this.lastInFocus = name;
                this.displayingTooltip = false;
                if (!(name in this.fieldsList)) {
                    var newField = _defineProperty({
                    }, name, {
                        obj: nodeObj,
                        msg: '',
                        controller: null,
                        status: 'off'
                    });
                    this.fieldsList = _objectSpread({
                    }, this.fieldsList, newField);
                    if (nodeObj.value != '') SetTimer();
                } else if (event.type == 'input' && event.inputType == 'deleteContentBackward') {
                    if (nodeObj.value != '') {
                        if (this.fieldsList[name].status == 'on') {
                            this.StopThis(name);
                        } else ClosePopUp();
                        SetTimer(720);
                    } else {
                        if (this.fieldsList[name].status == 'off') ClosePopUp();
                        this.fieldsList[name].obj.removeAttribute('isvalid');
                    }
                } else if (this.fieldsList[name].status == 'off' && nodeObj.value != '') {
                    ClosePopUp();
                    SetTimer();
                } else if (nodeObj.value != '') {
                    this.StopThis(name);
                    SetTimer();
                }
                if (this.dismissed == '' || this.dismissed == true) {
                    CloseOnOutOfFocus();
                    this.dismissed = false;
                }
                this.fieldsList[name].obj.setCustomValidity('');
                this.fieldsList[name].obj.setAttribute('isvalid', true);
            }
        },
        {
            /* 'use strict'; */ key: "StopAll",
            value: function StopAll() {
                var controller;
                var fieldName;
                for(var field in this.fieldsList){
                    fieldName = field.name;
                    if (fieldName in this.fieldsList) {
                        if (this.fieldsList[fieldName].controller != null) {
                            clearTimeout(this.fieldsList[fieldName].controller);
                            this.fieldsList[fieldName].controller = null;
                            this.fieldsList[fieldName].status = 'off';
                        }
                    }
                }
            }
        },
        {
            /* 'use strict'; */ key: "StopThis",
            value: function StopThis(obj) {
                if (obj in this.fieldsList && this.fieldsList[obj].controller != null) {
                    clearTimeout(this.fieldsList[obj].controller);
                    this.fieldsList[obj].controller = null;
                    this.fieldsList[obj].status = 'off';
                }
            }
        },
        {
            /* 'use strict'; */ key: "IsValid",
            value: function IsValid(objName, message) {
                var field = this.fieldsList[objName];
                var isInViewport = function(elem) {
                    var bounding = elem.getBoundingClientRect();
                    return bounding.top >= 0 && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
                };
                if (field.obj.value != '' && field.obj.checkValidity() == false) {
                    if (field.msg == '') {
                        field.msg = message;
                        field.obj.setCustomValidity(message);
                    }
                    if (document.activeElement.name == objName || document.activeElement.tagName == 'BODY' && this.lastInFocus == objName) {
                        if (isInViewport(field.obj) && field.obj.value != '') {
                            field.obj.reportValidity();
                        }
                        this.displayingTooltip = true;
                    }
                    field.controller = null;
                    field.status = 'off';
                    field.msg = '';
                    field.obj.setAttribute('isvalid', false);
                } else if (field.obj.value == '') {
                    field.controller = null;
                    field.status = 'off';
                    field.msg = '';
                }
            }
        },
        {
            /* 'use strict'; */ key: "ListenToField",
            value: function ListenToField(param) {
                var ref1 = param === void 0 ? {
                } : param, nodeList = ref1.nodeList, _type = ref1.type, type = _type === void 0 ? '' : _type, _customMessage = ref1.customMessage, customMessage = _customMessage === void 0 ? '' : _customMessage, _tooltipTime = ref1.tooltipTime, tooltipTime = _tooltipTime === void 0 ? '' : _tooltipTime;
                var inputHandler;
                var assignToEvents = (function(element) {
                    var message = customMessage;
                    if (element.type == type || type == '') {
                        if (element.tagName == 'INPUT' && element.type != 'hidden' && !element.id.includes('botcheck')) {
                            if (message == '') {
                                if (element.hasAttribute('tooltip')) {
                                    message = element.getAttribute('tooltip');
                                } else console.warn('No message defined, using default tooltip.');
                            }
                            if (!element.hasAttribute('inputType')) {
                                element.addEventListener('input', (function(evt) {
                                    this.CheckOn(evt, element, message, tooltipTime != '' ? tooltipTime : undefined);
                                }).bind(this));
                            } else if (element.getAttribute('inputType') == 'calendar') {
                                element.addEventListener('blur', (function(evt) {
                                    this.CheckOn(evt, element, message, tooltipTime != '' ? tooltipTime : undefined);
                                }).bind(this));
                            }
                            element.form.addEventListener('submit', function(ev) {
                                if (element.value == '') {
                                    element.setAttribute('required', '');
                                    element.setCustomValidity('Este campo é obrigatório!');
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    element.reportValidity();
                                }
                            });
                        }
                    } else {
                        throw console.error("Type is invalid.");
                        return;
                    }
                }).bind(this);
                if (nodeList != undefined || nodeList != null) {
                    inputHandler = nodeList;
                } else {
                    throw console.error('Node list is empty!');
                    return;
                }
                if (inputHandler instanceof NodeList && inputHandler.length > 0) {
                    var mismatchCount = 0;
                    for(var field in inputHandler){
                        if (inputHandler.hasOwnProperty(field)) {
                            var element = inputHandler[field];
                            if (element.tagName == 'INPUT') assignToEvents(element);
                            else mismatchCount += 1;
                        }
                    }
                    if (mismatchCount == inputHandler.length) {
                        throw console.warn("No inputs found!");
                    }
                } else if (inputHandler.tagName == 'INPUT') assignToEvents(inputHandler);
                else {
                    throw console.warn("No inputs found!");
                }
            }
        }
    ]);
    return FieldValidation;
}();
// Input masking using array with string format saved, and compare chars per index.
var CustomPlaceHolder = function() {
    "use strict";
    function CustomPlaceHolder(param) {
        var _Default = param.Default, Default = _Default === void 0 ? '' : _Default, _Custom = param.Custom, Custom = _Custom === void 0 ? '' : _Custom, _Target = param.Target, Target = _Target === void 0 ? undefined : _Target, _StartWithDefault = param.StartWithDefault, StartWithDefault = _StartWithDefault === void 0 ? true : _StartWithDefault;
        _classCallCheck(this, CustomPlaceHolder);
        this.DefaultHolder = Default;
        this.NewHolder = Custom;
        this.Node = Target;
        if (StartWithDefault == true) this.Node.placeholder = this.DefaultHolder;
    }
    _createClass(CustomPlaceHolder, [
        {
            key: "OnFocus",
            value: function OnFocus(param) {
                var _ReturnToDefault = param.ReturnToDefault, ReturnToDefault = _ReturnToDefault === void 0 ? true : _ReturnToDefault, _CustomColor = param.CustomColor, CustomColor = _CustomColor === void 0 ? '' : _CustomColor;
                var defaultColor;
                this.Node.onfocus = (function() {
                    this.Node.placeholder = this.NewHolder;
                }).bind(this);
                if (ReturnToDefault == true) {
                    this.Node.onblur = (function() {
                        this.Node.placeholder = this.DefaultHolder;
                    }).bind(this);
                }
            }
        }
    ]);
    return CustomPlaceHolder;
}();
var VideoController = function() {
    "use strict";
    function VideoController(playersList) {
        _classCallCheck(this, VideoController);
        this.players = playersList;
        this.loadIsComplete = false;
    }
    _createClass(VideoController, [
        {
            key: "HasLoaded",
            value: function HasLoaded(code) {
                var onInstanceCreated = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, player;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                if (this.loadIsComplete) {
                                    _ctx.next = 28;
                                    break;
                                }
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _ctx.prev = 2;
                                _iterator = this.players[Symbol.iterator]();
                            case 4:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _ctx.next = 13;
                                    break;
                                }
                                player = _step.value;
                                if (!(player.elements.controls === undefined)) {
                                    _ctx.next = 10;
                                    break;
                                }
                                _ctx.next = 9;
                                return setTimeout(function() {
                                    return onInstanceCreated();
                                }, 0.1);
                            case 9:
                                return _ctx.abrupt("return", _ctx.sent);
                            case 10:
                                _iteratorNormalCompletion = true;
                                _ctx.next = 4;
                                break;
                            case 13:
                                _ctx.next = 19;
                                break;
                            case 15:
                                _ctx.prev = 15;
                                _ctx.t0 = _ctx["catch"](2);
                                _didIteratorError = true;
                                _iteratorError = _ctx.t0;
                            case 19:
                                _ctx.prev = 19;
                                _ctx.prev = 20;
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            case 22:
                                _ctx.prev = 22;
                                if (!_didIteratorError) {
                                    _ctx.next = 25;
                                    break;
                                }
                                throw _iteratorError;
                            case 25:
                                return _ctx.finish(22);
                            case 26:
                                return _ctx.finish(19);
                            case 27:
                                /* console.log('but setting to true'); */ this.loadIsComplete = true;
                            case 28:
                                code();
                            case 29:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this, [
                        [
                            20,
                            ,
                            22,
                            26
                        ],
                        [
                            2,
                            15,
                            19,
                            27
                        ]
                    ]);
                }).bind(this)).bind(this);
                onInstanceCreated();
            }
        },
        {
            key: "ExecuteOnAllPlayers",
            value: function ExecuteOnAllPlayers(method) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var player = _step.value;
                        method(player);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "PauseAll",
            value: function PauseAll() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var player = _step.value;
                        if (player.playing) {
                            player.pause();
                            return;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "StopAll",
            value: function StopAll() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var player = _step.value;
                        if (player.paused || player.playing) {
                            player.stop();
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "HideAllControls",
            value: function HideAllControls() {
                this.HasLoaded((function() {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var player = _step.value;
                            player.elements.controls.hidden = true;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }).bind(this));
            }
        },
        {
            key: "ShowAllControls",
            value: function ShowAllControls() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var player = _step.value;
                        player.elements.controls.hidden = false;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "DisablePlayOnClick",
            value: function DisablePlayOnClick(toggle, param) {
                var param1 = param === void 0 ? {
                    all: true,
                    player: null
                } : param;
                if (param1.all && !(param1.player != null)) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = this.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var pl = _step.value;
                            pl.config.clickToPlay = !toggle;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                } else if (param1.player != null) {
                    param1.player.config.clickToPlay = !toggle;
                }
            }
        }
    ]);
    return VideoController;
}();
var ScrollObserver = function() {
    "use strict";
    var _marked = regeneratorRuntime.mark(ScrollObserver);
    function ScrollObserver(param) {
        var ref1 = param === void 0 ? {
            observerOptions: undefined,
            customCallback: undefined
        } : param, observerOptions = ref1.observerOptions, customCallback = ref1.customCallback;
        _classCallCheck(this, ScrollObserver);
        var _this = this;
        _defineProperty(this, "_defaultOptions", function(steps) {
            return Array(steps + 1).fill(0).map(function(_, index) {
                return index / steps;
            });
        });
        this.Options = this._defaultOptions;
        this.Callback = (function(v) {
            this._defaultCallback(v);
        }).bind(this);
        this.State = {
            ascending: false,
            descending: false
        };
        this.OnScrollMove = function(val) {
            return new CustomEvent('OnScrollMove', {
                detail: {
                    Up: val === 'Up' ? true : false,
                    Down: val === 'Down' ? true : false
                }
            });
        };
        this.Initialized = false;
        this.TopPosition = {
            current: 0,
            previous: 0,
            direction: ''
        };
        this._numberOfSignedEvents = 0;
        this.Observer = new IntersectionObserver(this.Callback, {
            threshold: this.Options(10)
        });
        var _container = document.createDocumentFragment().appendChild(document.createElement('div'));
        _container.setAttribute('id', 'scrollMarkerContainer');
        Object.assign(_container.style, {
            position: 'absolute',
            top: 0
        });
        var gapBetweenMarkers = 1;
        var _markers = [];
        var position = window.innerHeight;
        var areaAvailable;
        var numberOfMarkers;
        var markersHeight;
        var rest;
        areaAvailable = document.documentElement.scrollHeight - document.documentElement.clientHeight - window.innerHeight;
        numberOfMarkers = Math.round(areaAvailable / (window.innerHeight - gapBetweenMarkers));
        for(var index = 0; index < numberOfMarkers; index++){
            _markers.push(_container.appendChild(document.createElement('div')));
            _markers[index].setAttribute('id', "scrollMarker".concat(index));
            this.Observer.observe(_markers[index]);
        }
        this.scrollMarker = {
            container: _container,
            markers: _markers
        };
        ScrollObserver.ActiveObservers.push(this);
        /* ************************************************ */ var scrollHeight = document.documentElement.scrollHeight;
        var scrollHeightHasChanged = function(delay) {
            new Promise(function(resolve1) {
                if (scrollHeight != document.documentElement.scrollHeight) {
                    scrollHeight = document.documentElement.scrollHeight;
                    resolve1(true);
                } else resolve1(false);
            });
        };
        var waitForHeightChange = function(delay) {
            var _waitFor = _asyncToGenerator(regeneratorRuntime.mark(function _callee(delay) {
                var safetyNet, changed;
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            ;
                            ;
                        case 2:
                            if (!(!changed && safetyNet < 10)) {
                                _ctx.next = 9;
                                break;
                            }
                            _ctx.next = 5;
                            return scrollHeightHasChanged(delay);
                        case 5:
                            changed = _ctx.sent;
                            safetyNet++;
                            _ctx.next = 2;
                            break;
                        case 9:
                            console.log(scrollHeight); // Need to wait more time !!!! 
                            return _ctx.abrupt("return");
                        case 11:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            function waitFor() {
                return _waitFor.apply(_this, arguments);
            }
            return waitFor;
        }();
        waitForHeightChange(200).then((function() {
            areaAvailable = scrollHeight - document.documentElement.clientHeight * 2;
            var newMarkersAmount = Math.round(areaAvailable / (window.innerHeight - gapBetweenMarkers));
            if (newMarkersAmount > numberOfMarkers) {
                for(var index1 = 0; index1 < newMarkersAmount - numberOfMarkers; index1++){
                    _markers.push(_container.appendChild(document.createElement('div')));
                    _markers[this.scrollMarker.markers.length - 1].setAttribute('id', "scrollMarker".concat(this.scrollMarker.markers.length));
                    this.Observer.observe(_markers[this.scrollMarker.markers.length - 1]);
                }
                numberOfMarkers = newMarkersAmount;
            }
            markersHeight = areaAvailable / numberOfMarkers;
            rest = numberOfMarkers * (markersHeight + gapBetweenMarkers) - areaAvailable;
            for(var index2 = 0; index2 < numberOfMarkers; index2++){
                if (index2 != 0) position = position + markersHeight + gapBetweenMarkers;
                if (index2 == numberOfMarkers - 1) markersHeight += rest * -1;
                Object.assign(_markers[index2].style, {
                    'position': 'absolute',
                    'height': "".concat(markersHeight, "px"),
                    'width': '1px',
                    'top': "".concat(position, "px"),
                    'z-index': '999'
                });
            }
            document.body.appendChild(this.scrollMarker.container);
        }).bind(this));
    }
    _createClass(ScrollObserver, [
        {
            /**
     * 
     * @param {IntersectionObserverEntry[]} entries 
     */ key: "_defaultCallback",
            value: function _defaultCallback(entries) {
                if (this.Initialized) {
                    if (this._numberOfSignedEvents < 1) return console.error('No signed event listeners');
                    this.TopPosition.current = window.scrollY;
                    if (this.TopPosition.current > this.TopPosition.previous || this.TopPosition.current === this.TopPosition.previous && this.TopPosition.direction === 'Down') {
                        this.State = {
                            'descending': true,
                            'ascending': false
                        };
                        this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Down'));
                        this.TopPosition.direction = 'Down';
                    } else if (this.TopPosition.current < this.TopPosition.previous || this.TopPosition.current === this.TopPosition.previous && this.TopPosition.direction === 'Up') {
                        this.State = {
                            'descending': false,
                            'ascending': true
                        };
                        this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Up'));
                        this.TopPosition.direction = 'Up';
                    }
                    this.TopPosition.previous = this.TopPosition.current;
                } else {
                    this.Initialized = true;
                }
            }
        },
        {
            key: "On",
            value: function On(param, param1) {
                var event2 = param === void 0 ? '' : param, callBack = param1 === void 0 ? undefined : param1;
                if (callBack !== undefined) {
                    if (event2 === 'OnScrollMove') {
                        this.scrollMarker.container.addEventListener('OnScrollMove', callBack);
                        this._numberOfSignedEvents += 1;
                    } else if (event2 === 'OnIntersectionEnter') {
                        this.scrollMarker.container.addEventListener('OnIntersectionEnter', callBack);
                        this._numberOfSignedEvents += 1;
                    } else if (event2 === 'OnIntersectionLeave') {
                        this.scrollMarker.container.addEventListener('OnIntersectionLeave', callBack);
                        this._numberOfSignedEvents += 1;
                    } else {
                        return console.error("Event not supported");
                    }
                } else console.error('Callback is undefined.');
            }
        },
        {
            key: "Off",
            value: function Off(param, param1) {
                var event2 = param === void 0 ? '' : param, callBack = param1 === void 0 ? undefined : param1;
                if (callBack !== undefined && this._numberOfSignedEvents > 0) {
                    if (event2 === 'OnScrollMove') {
                        this.scrollMarker.container.removeEventListener('OnScrollMove', callBack);
                        this._numberOfSignedEvents -= 1;
                    } else if (event2 === 'OnIntersectionEnter') {
                        this.scrollMarker.container.removeEventListener('OnIntersectionEnter', callBack);
                        this._numberOfSignedEvents -= 1;
                    } else if (event2 === 'OnIntersectionLeave') {
                        this.scrollMarker.container.removeEventListener('OnIntersectionLeave', callBack);
                        this._numberOfSignedEvents -= 1;
                    } else {
                        return console.error("Only event supported is OnScrollMove");
                    }
                } else console.error('Callback is undefined.');
            }
        }
    ]);
    return ScrollObserver;
}();
_defineProperty(ScrollObserver, "ActiveObservers", []);
var Sort = function() {
    "use strict";
    function Sort() {
        _classCallCheck(this, Sort);
    }
    _createClass(Sort, null, [
        {
            key: "quickSort",
            value: function quickSort(originalArray) {
                if (originalArray.length <= 1) {
                    return originalArray;
                } else {
                    var leftSide = [];
                    var rightSide = [];
                    var newArray = [];
                    var pivot = originalArray.pop();
                    var length = originalArray.length;
                    for(var i = 0; i < length; i++){
                        if (originalArray[i] <= pivot) {
                            leftSide.push(originalArray[i]);
                        } else {
                            rightSide.push(originalArray[i]);
                        }
                    } //END FOR   
                    return newArray.concat(Sort.quickSort(leftSide), pivot, Sort.quickSort(rightSide));
                } //END ELSE
            }
        }
    ]);
    return Sort;
}();
var WatchScrollPosition = function() {
    "use strict";
    function WatchScrollPosition() {
        _classCallCheck(this, WatchScrollPosition);
        this.Positions = [];
        this.Nodes = new Map(); ///
        this.ScrollObserver = undefined;
        this.Subscribers = {
        };
        this._lastPosition = undefined;
        this._positionOffset = 180;
    }
    _createClass(WatchScrollPosition, [
        {
            key: "GetElements",
            value: function GetElements(param) {
                var tmp = param.Tags, Tags = tmp === void 0 ? [] : tmp, tmp1 = param.ExcludedIDs, ExcludedIDs = tmp1 === void 0 ? [] : tmp1;
                var elements = new Map();
                var nodes, exclude, index2 = 0;
                if (!Array.isArray(Tags)) Tags = [
                    Tags
                ];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    var _this = this, _loop = function(_iterator, _step) {
                        var tag = _step.value;
                        nodes = document.querySelectorAll(tag);
                        if (ExcludedIDs.length > 0) {
                            ExcludedIDs = ExcludedIDs.filter(function(val) {
                                nodes = Array.from(nodes).filter(function(node) {
                                    return node.id == val ? !(exclude = true) : !(exclude = false);
                                });
                                return !exclude;
                            });
                            elements.set(tag, nodes);
                        } else {
                            elements.set(tag, Array.from(nodes));
                        }
                        elements.get(tag).map((function(node) {
                            _this.Nodes.set(node.getBoundingClientRect().top + window.pageYOffset - _this._positionOffset, node.id ? node.id : "node ".concat(index2));
                        }).bind(_this));
                        index2++;
                    };
                    for(var _iterator = Tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                this.Positions = Array.from(this.Nodes.keys(), function(val) {
                    return parseFloat(val);
                });
            }
        },
        {
            /**
     * 
     * @param {Object} WatchInfo
     * @param {function(number, Map)} WatchInfo.Callback
     * @param {ScrollObserver} WatchInfo.Observer
     * @return {void} void
     */ key: "Watch",
            value: function Watch(param) {
                var tmp = param.State, State = tmp === void 0 ? true : tmp, tmp1 = param.Callback, Callback = tmp1 === void 0 ? undefined : tmp1, tmp2 = param.scrollObserver, scrollObserver = tmp2 === void 0 ? undefined : tmp2;
                if (State) {
                    if (Callback !== undefined) this.Subscribers[Callback.name] = Callback;
                    else return new Error('Callback is not defined');
                    if (scrollObserver === undefined) {
                        if (this.ScrollObserver === undefined) {
                            if (ScrollObserver.ActiveObservers.length > 0) {
                                this.ScrollObserver = ScrollObserver.ActiveObservers[0];
                            } else {
                                this.ScrollObserver = new ScrollObserver();
                            }
                        }
                    } else if (this.ScrollObserver === undefined) {
                        this.ScrollObserver = scrollObserver;
                    }
                    this.ScrollObserver.On('OnScrollMove', (function() {
                        for(var i = 0; i < this.Positions.length; i++){
                            var position = this.Positions[i];
                            if (window.pageYOffset >= position && !(window.pageYOffset >= this.Positions[i + 1]) && position != this._lastPosition) {
                                this._lastPosition = position;
                                if (Callback !== undefined) {
                                    for(var subscriber in this.Subscribers){
                                        this.Subscribers[subscriber](position, this.Nodes);
                                    }
                                    break;
                                } else return new Error('Callback is null.');
                            }
                        }
                    }).bind(this));
                } else {
                    for(var method in this.Subscribers){
                        if (method == Callback.name) {
                            delete this.Subscribers[method];
                            return;
                        }
                    }
                }
            }
        },
        {
            key: "CurrentSection",
            value: function CurrentSection() {
                var windowPosition = window.pageYOffset;
                for(var i = 0; i < this.Positions.length; i++){
                    var sectionPosition = this.Positions[i];
                    if (windowPosition >= sectionPosition && !(windowPosition >= this.Positions[i + 1])) {
                        return this.Nodes.get(this.Positions[i]);
                    } else if (windowPosition < this.Positions[0]) {
                        return this.Nodes.get(this.Positions[0]);
                    }
                }
            }
        }
    ]);
    return WatchScrollPosition;
}();
var ActiveMenuLink = function() {
    "use strict";
    function ActiveMenuLink() {
        _classCallCheck(this, ActiveMenuLink);
        this.ActiveButton = undefined;
        this.NewButton = undefined;
    }
    _createClass(ActiveMenuLink, [
        {
            key: "ScrollingIntoView",
            value: function ScrollingIntoView(state) {
                ActiveMenuLink.ScrollIntoView = state;
            }
        },
        {
            key: "Change",
            value: /**
     * 
     * @param {string} SectionID 
     */ function Change(param) {
                var _SectionID = param.SectionID, SectionID = _SectionID === void 0 ? undefined : _SectionID;
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                if (ActiveMenuLink.ScrollIntoView) {
                                    _ctx.next = 8;
                                    break;
                                }
                                if (this.ActiveButton == undefined) this.ActiveButton = document.querySelector('.current');
                                this.NewButton = document.querySelector(SectionID[0] == '#' ? "".concat(SectionID, "--button") : "#".concat(SectionID, "--button"));
                                if (!(this.NewButton != undefined)) {
                                    _ctx.next = 7;
                                    break;
                                }
                                {
                                    if (this.ActiveButton.id != this.NewButton.id) {
                                        this.ActiveButton.classList.remove("current");
                                        this.ActiveButton = this.NewButton.parentElement;
                                        this.ActiveButton.classList.add("current");
                                    }
                                }
                                _ctx.next = 8;
                                break;
                            case 7:
                                return _ctx.abrupt("return", new console.error("Can't find node with specified ID"));
                            case 8:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this);
                }).bind(this))();
            }
        }
    ]);
    return ActiveMenuLink;
}();
_defineProperty(ActiveMenuLink, "ScrollIntoView", false);
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        if (immediate && !timeout) func.apply(context, args);
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
    };
}
var innerVisualHeight = function() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
};
/* window.addEventListener('resize', debounce(innerVisualHeight, 150)); */ document.addEventListener('DOMContentLoaded', innerVisualHeight);
var ActiveMenu = new ActiveMenuLink();
var HideNavbar = void 0;
var Navbar = void 0;
if (document.documentElement.clientWidth >= 834) {
    HideNavbar = new ScrollObserver();
    Navbar = document.querySelector('#header-wrap');
    HideNavbar.On('OnScrollMove', function(val) {
        if (val.detail.Up) {
            Navbar.style = "opacity: 1;";
        } else {
            Navbar.style = "opacity: 0;";
        }
    });
} /* Instead of only hiding the navbar when the sticky-header class is enabled, it hides in any scroll down. 
In this new version, the opacity is set to 0.*/ 
var ActiveSection = new WatchScrollPosition();
ActiveSection.GetElements({
    Tags: 'section',
    ExcludedIDs: [
        'content',
        'slider'
    ]
});
ActiveSection.Watch({
    State: true,
    Callback: function(pos, arr) {
        ActiveMenu.Change({
            SectionID: arr.get(pos)
        });
    }
});
ActiveMenu.Change({
    SectionID: ActiveSection.CurrentSection()
});
var header = document.querySelector('#header');
var isSticky = ScrollObserver.ActiveObservers[0].On('OnScrollMove', function(val) {
    if (val.detail.Down) {
        if (window.pageYOffset > 110) {
            if (header.classList.contains('sticky-header')) return;
            else header.classList.add('sticky-header');
        }
    } else {
        if (window.pageYOffset < 110) {
            if (header.classList.contains('sticky-header')) header.classList.remove('sticky-header');
            else return;
        }
    }
});
var supportsSmoothScrolling = function() {
    var body = document.body;
    var defaultScrollBehavior = body.style.scrollBehavior;
    body.style.scrollBehavior = 'smooth';
    var hasSmooth = getComputedStyle(body).scrollBehavior === 'smooth';
    body.style.scrollBehavior = defaultScrollBehavior;
    return hasSmooth;
}();
var supportsScrollMargin = function() {
    var body = document.body;
    var defaultScrollMarginTop = body.style.scrollMarginTop;
    body.style.scrollMarginTop = '1px';
    var hasSupport = getComputedStyle(body).scrollMarginTop;
    body.style.scrollMarginTop = defaultScrollMarginTop;
    return hasSupport;
}();
if (!supportsScrollMargin) {
    var hasClass = document.body.classList.contains('no-scroll-margin');
    if (!hasClass) document.body.classList.add('no-scroll-margin');
    var scrollMarginFragment = new DocumentFragment();
    var scrollMarginMarker = document.createElement('span');
    Object.assign(scrollMarginMarker.style, {
        'position': 'absolute',
        'height': "1px",
        'width': '1px',
        'top': "0",
        'z-index': '999'
    });
    scrollMarginMarker.id = "scrollMarginMarker";
    scrollMarginFragment.appendChild(scrollMarginMarker);
    document.body.appendChild(scrollMarginFragment);
}
/* let header = document.querySelector('#header');
ActiveSection.ScrollObserver.On('OnScrollMove', debounce(() => {
    if(!header.classList.contains('sticky-header')) header.classList.add('sticky-header');
}, 75, true)) */ var mobileMenu = document.documentElement.clientWidth <= 834 ? document.querySelector('#primary-menu-trigger') : undefined;
var ScrollIntoView = _asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
    var element = param === void 0 ? undefined : param;
    var node, scrollMarginMarker, before, position, click;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!(element != undefined)) {
                    _ctx.next = 17;
                    break;
                }
                ActiveMenu.Change({
                    SectionID: element
                });
                ActiveMenu.ScrollingIntoView(true);
                ActiveSection.Watch({
                    State: true,
                    Callback: function Unsubscribe(pos, arr) {
                        if ("#".concat(arr.get(pos)) == element) {
                            ActiveSection.Watch({
                                State: false,
                                Callback: Unsubscribe
                            });
                            ActiveMenu.ScrollingIntoView(false);
                        }
                    }
                });
                node = document.querySelector(element == '#home' ? mobileMenu != undefined ? '#slider' : '#header' : element);
                _ctx.prev = 5;
                if (!supportsSmoothScrolling) {
                    _ctx.next = 10;
                    break;
                }
                {
                    node.scrollIntoView({
                        behavior: 'smooth',
                        alignToTop: 'false'
                    });
                }
                _ctx.next = 11;
                break;
            case 10:
                throw new Error('Smooth behavior is not supported.');
            case 11:
                _ctx.next = 16;
                break;
            case 13:
                _ctx.prev = 13;
                _ctx.t0 = _ctx["catch"](5);
                if (supportsScrollMargin) window.scrollIntoView(node, {
                    behavior: "smooth",
                    duration: 300,
                    block: "start"
                });
                else {
                    scrollMarginMarker = document.body.querySelector('#scrollMarginMarker');
                    before = getComputedStyle(node, ':before');
                    position = node.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
                    position += parseInt(before.top, 10);
                    scrollMarginMarker.style.top = "".concat(position, "px");
                    if (node.id == 'slider') window.scrollIntoView(node, {
                        behavior: "smooth",
                        duration: 300,
                        block: "start"
                    });
                    else window.scrollIntoView(scrollMarginMarker, {
                        behavior: "smooth",
                        duration: 300,
                        block: "start"
                    });
                }
            case 16:
                if (mobileMenu != undefined) {
                    click = new MouseEvent('click');
                    mobileMenu.dispatchEvent(click);
                }
            case 17:
            case "end":
                return _ctx.stop();
        }
    }, _callee, null, [
        [
            5,
            13
        ]
    ]);
}));
var menuButtons = document.querySelectorAll('.menu-container li>a');
var registerButtons = function(buttons) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        var _loop = function(_iterator, _step) {
            var button = _step.value;
            var sectionId = "#".concat(button.id.split("--")[0]);
            button.addEventListener('click', function(ev) {
                ScrollIntoView(sectionId);
            });
        };
        for(var _iterator = buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};
registerButtons(menuButtons);
var callToActionButton = document.querySelector('#home .home-button');
var node = document.querySelector('.perfil-detalhes--link-wrapper');
callToActionButton.addEventListener('click', function() {
    try {
        if (supportsSmoothScrolling) {
            node.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else throw new Error('Smooth behavior not supported');
    } catch (error) {
        if (supportsScrollMargin) window.scrollIntoView(node, {
            behavior: "smooth",
            duration: 300,
            block: "start"
        });
        else {
            var scrollMarginMarker = document.body.querySelector('#scrollMarginMarker');
            var before = getComputedStyle(node, ':before');
            var position = node.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
            position += parseInt(before.top, 10);
            scrollMarginMarker.style.top = "".concat(position, "px");
            window.scrollIntoView(scrollMarginMarker, {
                behavior: "smooth",
                duration: 300,
                block: "start"
            });
        }
    }
});
/* fitty('#video-section-play-title', {multiline:true}); */ /* fitty('#video-section-description-parent'); */ // Add the attribute search-active to the search bar panel and control when it's true or not.
/* ScrollReveal().reveal(document.querySelectorAll('.mainpage-experience-block-elements img')); */ var OverlayCarousel = function() {
    var carousel = new Flickity(document.querySelector(".video-carousel"), {
        wrapAround: true,
        contain: true,
        cellAlign: 'left'
    });
    var selectedSlide = carousel.selectedElement;
    return {
        instance: carousel,
        currentSlide: selectedSlide,
        startTransition: function startTransition(code) {
            var previousCanvas = this.currentSlide.firstElementChild;
            var newCanvas = this.instance.selectedElement.firstElementChild;
            if (!newCanvas.classList.contains("video-carousel--fade-complete")) {
                newCanvas.classList.add("video-carousel--fade-complete");
                if (code !== undefined) {
                    var pauseWhenTransitioned = (function() {
                        code();
                        this.instance.selectedElement.removeEventListener("transitionend", pauseWhenTransitioned);
                    }).bind(this);
                    this.instance.selectedElement.addEventListener('transitionend', pauseWhenTransitioned);
                }
            }
            if (newCanvas != previousCanvas) {
                previousCanvas.classList.remove("video-carousel--fade-complete");
                this.currentSlide = this.instance.selectedElement;
            }
        },
        resetTransitions: function resetTransitions() {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = this.instance.cells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var cell = _step.value;
                    var canvas = cell.element.firstElementChild;
                    if (canvas.classList.contains("video-carousel--fade-complete")) {
                        canvas.classList.remove("video-carousel--fade-complete");
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    };
}();
var playerController;
function LoadIframes() {
    var iframeSpots = document.querySelectorAll(".video-player");
    var iframeModel = document.createElement("iframe");
    iframeModel.allowFullscreen = true;
    iframeModel.setAttribute("allowtransparency", true);
    iframeModel.allow = "autoplay";
    var baseURL = "https://www.youtube.com/embed/";
    playerController = new VideoController(new Array());
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = iframeSpots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var node1 = _step.value;
            var clone = iframeModel.cloneNode();
            clone.src = baseURL + node1.getAttribute('js-data');
            node1.appendChild(clone);
            var player = new Plyr(node1);
            /*    let pauseOverlay = document.createElement("div");
        pauseOverlay.className = "obscure-on-pause";
        player.elements.container.appendChild(pauseOverlay); */ playerController.players.push(player);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
/* document.body.addEventListener('load', LoadIframes()); */ var EnableOverlay = new function() {
    var videoSection = document.querySelector("#video-section-play-title"); /* Make this whole function as a class and remove this query, by searching the children directly. */ 
    var playButton = videoSection.querySelector('.play-video');
    var overlay = videoSection.querySelector('.video-overlay');
    var carouselButtons = document.querySelectorAll(".flickity-button");
    var videoDescriptions = document.querySelector(".video-overlay--descriptions").children;
    var videoCarousel = document.querySelector(".video-carousel");
    playButton.addEventListener('click', function() {
        var enableOverlay = function enableOverlay(isActive) {
            document.querySelector("body").style = isActive ? "overflow:hidden;" : "overflow:visible";
            return isActive;
        };
        var changeActiveDescription = function changeActiveDescription(index2) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = videoDescriptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var el = _step.value;
                    el.classList.remove("--active-video");
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            videoDescriptions[index2].classList.add("--active-video");
        };
        if (playerController === undefined) {
            LoadIframes();
        }
        OverlayCarousel.resetTransitions();
        OverlayCarousel.instance.on('change', function() {
            playerController.HideAllControls();
            OverlayCarousel.startTransition(function() {
                playerController.PauseAll();
                playerController.StopAll();
            });
            changeActiveDescription(OverlayCarousel.instance.selectedIndex);
        });
        changeActiveDescription(OverlayCarousel.instance.selectedIndex);
        OverlayCarousel.startTransition();
        var stopOnEnd = function(ev) {
            ev.detail.plyr.stop();
        };
        var executeOnPlay = function() {
            playerController.ShowAllControls();
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                var _loop = function(_iterator, _step) {
                    var button = _step.value;
                    var hideButton = function() {
                        return button.classList.add("flickity-button--hidden");
                    };
                    var showButton = function() {
                        button.classList.remove("flickity-button--hidden");
                        playerController.ExecuteOnAllPlayers(function(player) {
                            return player.elements.container.removeEventListener('pause', showButton);
                        });
                    };
                    playerController.ExecuteOnAllPlayers(function(player) {
                        return player.elements.container.addEventListener('pause', showButton);
                    });
                    hideButton();
                };
                for(var _iterator = carouselButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };
        playerController.ExecuteOnAllPlayers(function(player) {
            player.elements.container.addEventListener('ended', stopOnEnd);
            player.elements.container.addEventListener('playing', executeOnPlay);
        });
        playerController.StopAll();
        playerController.HideAllControls();
        var changeOverlayStatus = function() {
            overlay.setAttribute('active', overlay.getAttribute('active') == 'false' ? enableOverlay(true) : enableOverlay(false));
        };
        changeOverlayStatus();
        var DisablePlayOnDrag = function(ev) {
            var CancelClick = function(ev1) {
                ev1.stopPropagation();
                window.removeEventListener('click', CancelClick, true);
            };
            window.addEventListener('click', CancelClick, true);
        };
        OverlayCarousel.instance.on('dragStart', DisablePlayOnDrag);
        overlay.addEventListener('click', function CloseOverlay(ev) {
            if (ev.target != this && !ev.target.classList.contains('icon-line-cross') && !ev.target.classList.contains('video-overlay-close')) {
                return;
            }
            changeOverlayStatus();
            overlay.removeEventListener('click', CloseOverlay);
            OverlayCarousel.instance.select(0, false, true);
            /* overlay.firstElementChild.removeEventListener('click',PreventParentClick);  */ playerController.PauseAll();
            playerController.ExecuteOnAllPlayers(function(player) {
                player.elements.container.removeEventListener('ended', stopOnEnd);
                player.elements.container.removeEventListener('playing', executeOnPlay);
            });
            OverlayCarousel.instance.off('dragStart', DisablePlayOnDrag);
        });
        OverlayCarousel.instance.resize();
    });
};
/* let searchButton = document.getElementById("top-search-trigger");
let searchPanel = searchButton.closest(".header-row");
searchPanel.setAttribute('search-active',false);

searchButton.addEventListener('click', () => {
    let typedOnSearchBar;
    let searchBlur;
    let searchInput = document.getElementById("main-search-bar");
    searchInput.setAttribute('empty', true);
    if(searchPanel.hasAttribute("search-active") && searchPanel.getAttribute('search-active') == "false"){
        if(searchInput.value != '') searchInput.value = '';
        searchPanel.setAttribute('search-active',true);
        typedOnSearchBar = (ev) => {
            if(ev.inputType != "deleteContentBackward" && !searchInput.value == ''){
                searchInput.setAttribute('empty', false);
            }
            else if(ev.inputType == "deleteContentBackward" && searchInput.value == ''){
                searchInput.setAttribute('empty', true);
            }
        }
        searchBlur = (ev) => {
            if(ev.target.id != "main-search-bar" && ev.target.id != "close-search-bar" ){
                if (searchPanel.getAttribute('search-active') == "true") {
                    searchPanel.setAttribute('search-active',false);
                    document.removeEventListener('click', searchBlur);
                    searchInput.removeEventListener('input', typedOnSearchBar);
                }
            }

        }
        searchInput.addEventListener('input', typedOnSearchBar);
        document.addEventListener('click', searchBlur);
        searchInput.focus();
    }
    else if (searchPanel.getAttribute('search-active') == "true") {
        searchPanel.setAttribute('search-active',false);
        searchInput.removeEventListener('input', typedOnSearchBar);
        document.removeEventListener('click', searchBlur);
    }
}) */ /* Disabled search features */ // Update the contact form to the correct city, based on the button pressed.
var tabPanel = document.querySelector('.tab-pane');
var form = tabPanel.querySelector('form');
var tabsContainer = document.querySelector('#cityTabs');
var tabs = tabsContainer.querySelectorAll('a');
var tabState = {
    current: ''
};
tabsContainer.addEventListener('OnTabFocusChange', function(ev) {
    var newTab = ev.target.id;
    if (tabState.current != newTab) {
        var keys = Object.keys(tabState);
        for(var i = 1; i < keys.length; i++){
            var tab = keys[i];
            if (tab != newTab && tabState[tab].node.classList.contains('active')) {
                tabState[tab].node.classList.remove('active');
                tabState[tab].isActive = false;
            }
        }
        tabState[newTab].node.classList.add('active');
        tabState[newTab].isActive = true;
        tabState['current'] = newTab;
    }
});
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = tabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var tab = _step.value;
        tabState[tab.id] = tab.classList.contains('active') ? (function() {
            tabState['current'] = tab.id;
            return {
                isActive: true,
                node: tab
            };
        })() : {
            isActive: false,
            node: tab
        };
        tab.addEventListener('click', function(ev) {
            var cityName = ev.target.getAttribute('aria-controls');
            var isActive = ev.target.classList.contains('active');
            if (!isActive) {
                /* form.setAttribute('fieldset','disabled') */ ev.target.dispatchEvent(new CustomEvent('OnTabFocusChange', {
                    bubbles: true
                }));
                tabPanel.id = cityName;
                tabPanel.setAttribute('aria-labelledby', ev.target.id);
                tabPanel.classList.remove('show');
                tabsContainer.setAttribute('activeTab', ev.target.id);
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    for(var _iterator1 = form.elements[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var field = _step1.value;
                        field.disabled = true;
                        if (field.hasAttribute('required')) field.removeAttribute('required');
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
                setTimeout(function() {
                    var cityField = form.elements.namedItem('contato-form-city'); //Requesting the city field inside the form.
                    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        for(var _iterator2 = form.elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            var field = _step2.value;
                            field.setCustomValidity('');
                            field.removeAttribute('isvalid');
                            field.disabled = false;
                            field.value = '';
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                    cityField.value = cityName.charAt(0).toUpperCase() + cityName.slice(1); //Changing the first letter of the word to uppercase and mergin with the rest of the word.
                    tabPanel.classList.add('show');
                }, 300);
            }
        });
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally{
    try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
        }
    } finally{
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
var menuIsOpen = false;
var executeOnMenuOpened = new MutationObserver(function(mutationList, observer) {
    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
    try {
        for(var _iterator2 = mutationList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
            var mutation = _step2.value;
            if (mutation.type == 'attributes' && mutation.attributeName == 'class') {
                if (mutation.target.classList.contains('primary-menu-open')) {
                    if (menuIsOpen == false) {
                        bodyScrollLock.disableBodyScroll(mutation.target);
                        menuIsOpen = true;
                    }
                } else if (menuIsOpen == true) {
                    bodyScrollLock.enableBodyScroll(mutation.target);
                    document.getElementsByClassName('header-wrap-clone')[0].removeAttribute('style');
                    menuIsOpen = false;
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
            }
        } finally{
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
});
executeOnMenuOpened.observe(document.querySelector("body"), {
    attributes: true
});
var fieldValidation = new FieldValidation();
fieldValidation.ListenToField({
    nodeList: document.querySelectorAll("input[id^='contato-form']")
});
var emailPlaceHolder = new CustomPlaceHolder({
    Default: 'Seu email',
    Custom: 'email@dominio.com',
    Target: document.getElementById('contato-form-email'),
    StartWithDefault: true
}).OnFocus({
    ReturnToDefault: true
});
var calendarPlaceHolder = new CustomPlaceHolder({
    Default: "Data de Interesse",
    Custom: "DD/MM/AAAA",
    Target: document.getElementById('contato-form-date'),
    StartWithDefault: true
}).OnFocus({
    ReturnToDefault: true
});
var phonePlaceHolder = new CustomPlaceHolder({
    Default: "Seu Telefone",
    Custom: '(DD) X XXXX-XXXX',
    Target: document.getElementById('contato-form-phone'),
    StartWithDefault: true
}).OnFocus({
    ReturnToDefault: true
});
jQuery('.home-date').datepicker({
    language: 'pt-BR',
    autoclose: true,
    startDate: "tomorrow",
    endDate: "+2m"
});
/* testing.On('OnScrollDown',()=>{}); */ var perfilButtons = {
};
perfilButtons.curriculo = document.getElementById("curriculo-session");
perfilButtons.simposios = document.getElementById("simposio-session");
perfilButtons.publicacoes = document.getElementById("publicacoes-session");
var enableSession = function(el) {
    var activeButton = el.currentTarget;
    var block = document.getElementsByClassName('perfil-container')[0];
    var isMobile = document.documentElement.clientWidth <= 834;
    if (!document.body.classList.contains('--obscured')) {
        if (isMobile) {
            document.body.classList.add('--obscured');
        }
    }
    if (isMobile) innerVisualHeight();
    if (!el.currentTarget.classList.contains('--active')) {
        block.classList.add('--active');
        for(var button in perfilButtons){
            button = perfilButtons[button];
            if (button.id != activeButton.id) {
                if (!button.classList.contains('--inactive')) {
                    button.classList.add('--inactive');
                    if (isMobile) bodyScrollLock.enableBodyScroll(button);
                }
            } else {
                if (button.classList.contains('--inactive')) {
                    button.classList.remove('--inactive');
                }
                if (!button.classList.contains('--active')) {
                    button.classList.add('--active');
                    if (isMobile) bodyScrollLock.disableBodyScroll(button);
                }
            }
        }
    } else {
        block.classList.remove('--active');
        el.currentTarget.classList.remove('--active');
        for(var button in perfilButtons){
            button = perfilButtons[button];
            button.classList.remove('--inactive');
        }
        if (document.body.classList.contains('--obscured')) {
            document.body.classList.remove('--obscured');
        }
        if (isMobile) bodyScrollLock.clearAllBodyScrollLocks();
    }
};
for(var button in perfilButtons){
    button = perfilButtons[button];
    button.addEventListener('click', enableSession, true);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
"use strict";
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(666);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Custom_customizations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(974);
/* harmony import */ var _Custom_customizations__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Custom_customizations__WEBPACK_IMPORTED_MODULE_1__);

/* var jquery = require('../Libraries/jquery.min')
var $ = jquery;
var jQuery = jquery;
window.$ = jquery;
require('../Libraries/jquery.easing.min');
require('../Libraries/bootstrap.min');
require('../Libraries/bootstrap-datepicker.min');
require('../Libraries/bootstrap-datepicker.pt-BR.min');
require('../Libraries/flickity.pkgd.min');
require('../Libraries/plyr.min'); */ /* require('../Custom/customizations.js'); */ 

})();

/******/ })()
;