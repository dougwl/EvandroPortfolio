/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
/* const { resolve } = require("core-js/fn/promise");
 */ /* Just a new comment */ //Some new tests
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
                var ref = param === void 0 ? {
                } : param, nodeList = ref.nodeList, _type = ref.type, type = _type === void 0 ? '' : _type, _customMessage = ref.customMessage, customMessage = _customMessage === void 0 ? '' : _customMessage, _tooltipTime = ref.tooltipTime, tooltipTime = _tooltipTime === void 0 ? '' : _tooltipTime;
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
        var ref = param === void 0 ? {
            observerOptions: undefined,
            customCallback: undefined
        } : param, observerOptions = ref.observerOptions, customCallback = ref.customCallback;
        _classCallCheck(this, ScrollObserver);
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
        var gap = 1;
        var _markers = [];
        var position = window.innerHeight;
        var freeArea = function() {
            return document.documentElement.scrollHeight - document.documentElement.clientHeight * 2;
        };
        var oldFreeArea = freeArea();
        var numberOfMarkers;
        var markersHeight;
        var leftover;
        numberOfMarkers = Math.round(freeArea() / (document.documentElement.clientHeight - gap));
        markersHeight = document.documentElement.clientHeight - gap;
        leftover = freeArea() - (document.documentElement.clientHeight - gap) * numberOfMarkers;
        if (leftover > 0) numberOfMarkers++;
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
        for(var index1 = 0; index1 < numberOfMarkers; index1++){
            if (index1 != 0) position = position + markersHeight + gap;
            if (index1 == numberOfMarkers - 1) markersHeight = leftover;
            Object.assign(_markers[index1].style, {
                'position': 'absolute',
                'height': "".concat(markersHeight, "px"),
                'width': '1px',
                'top': "".concat(position, "px"),
                'z-index': '999'
            });
        }
        document.body.appendChild(this.scrollMarker.container);
        /* ************************************************ */ var scrollHeight = document.documentElement.scrollHeight;
        var scrollHeightHasChanged = function(delay) {
            return new Promise(function(resolve) {
                var Resolve = function(state) {
                    setTimeout(function() {
                        return resolve(state);
                    }, delay);
                };
                if (scrollHeight != document.documentElement.scrollHeight) {
                    scrollHeight = document.documentElement.scrollHeight;
                    Resolve(true);
                } else {
                    Resolve(false);
                }
            });
        };
        var waitForHeightChange = _asyncToGenerator(regeneratorRuntime.mark(function _callee(interval, param1, param2) {
            var optimalTime = param1 === void 0 ? 0 : param1, maxTime = param2 === void 0 ? 0 : param2;
            var hasChanged, decurredTime, strikeOut, maxStrikes;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        hasChanged = false;
                        decurredTime = 0;
                        strikeOut = 0;
                        maxStrikes = (maxTime + optimalTime) / 2 / interval; // Average value between min/max , divided by the interval;
                    case 4:
                        if (!(decurredTime < optimalTime || decurredTime < maxTime)) {
                            _ctx.next = 12;
                            break;
                        }
                        _ctx.next = 7;
                        return scrollHeightHasChanged(interval);
                    case 7:
                        hasChanged = _ctx.sent;
                        hasChanged ? strikeOut-- : strikeOut++;
                        decurredTime += interval;
                        _ctx.next = 4;
                        break;
                    case 12:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        /* waitForHeightChange(100, 1000, 3000).then() */ window.addEventListener('load', (function() {
            var availableSpace = freeArea() > oldFreeArea ? freeArea() - oldFreeArea : 0; // if bigger, realize operation between () --> &&()
            if (availableSpace > 0.1) {
                markersHeight = document.documentElement.clientHeight - gap;
                var lastMarker = function() {
                    return _markers[_markers.length - 1];
                };
                var lastMarkerHeight = function() {
                    return parseFloat(lastMarker().style.height);
                };
                while(availableSpace > 0){
                    var dif = void 0;
                    if (availableSpace <= 30) {
                        lastMarker().style.height = "".concat(lastMarkerHeight() + availableSpace - _markers.length, "px");
                        return;
                    }
                    if (lastMarkerHeight() < markersHeight) {
                        dif = availableSpace;
                        availableSpace -= markersHeight - lastMarkerHeight();
                        if (availableSpace > 30) {
                            lastMarker().style.height = "".concat(lastMarkerHeight() + (markersHeight - lastMarkerHeight()) - _markers.length, "px");
                        } else {
                            availableSpace = dif;
                            lastMarker().style.height = "".concat(lastMarkerHeight() + availableSpace - _markers.length, "px");
                            return;
                        }
                    }
                    _markers.push(_container.appendChild(document.createElement('div')));
                    lastMarker().setAttribute('id', "scrollMarker".concat(_markers.length - 1));
                    Object.assign(lastMarker().style, {
                        'position': 'absolute',
                        'height': "0px",
                        'width': '1px',
                        'top': "".concat(parseFloat(lastMarker().style.top) + markersHeight + gap, "px"),
                        'z-index': '999'
                    });
                    this.Observer.observe(lastMarker());
                }
            }
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
                var nodes, exclude, index = 0;
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
                            _this.Nodes.set(node.getBoundingClientRect().top + window.pageYOffset - _this._positionOffset, node.id ? node.id : "node ".concat(index));
                        }).bind(_this));
                        index++;
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
                    var body;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                if (ActiveMenuLink.ScrollIntoView) {
                                    _ctx.next = 9;
                                    break;
                                }
                                body = document.body;
                                if (this.ActiveButton == undefined) this.ActiveButton = document.querySelector('.current');
                                this.NewButton = document.querySelector(SectionID[0] == '#' ? "".concat(SectionID, "--button") : "#".concat(SectionID, "--button"));
                                if (!(this.NewButton != undefined)) {
                                    _ctx.next = 8;
                                    break;
                                }
                                {
                                    if (this.ActiveButton.id != this.NewButton.id) {
                                        this.ActiveButton.classList.remove("current");
                                        this.ActiveButton = this.NewButton.parentElement;
                                        this.ActiveButton.classList.add("current");
                                        body.setAttribute("active-section", SectionID);
                                    }
                                }
                                _ctx.next = 9;
                                break;
                            case 8:
                                return _ctx.abrupt("return", new console.error("Can't find node with specified ID"));
                            case 9:
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
        var changeActiveDescription = function changeActiveDescription(index) {
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
            videoDescriptions[index].classList.add("--active-video");
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
var whatsNumber = 9999999999999;
var whatsURL = "https://wa.me/";
var whatsMessage = "?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Evandro!";
var whatsCompleteURL = "".concat(whatsURL).concat(whatsNumber).concat(whatsMessage);
var chatBubble = document.querySelector(".chat-bubble");
if (chatBubble) {
    chatBubble.addEventListener('click', function() {
        window.open(whatsCompleteURL);
    });
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
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