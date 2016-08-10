(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["shiorif"] = factory();
	else
		root["shiorif"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Shiorif = undefined;
	
	var _assign = __webpack_require__(1);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _getPrototypeOf = __webpack_require__(38);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(43);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(44);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(48);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(83);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _shiorijk = __webpack_require__(91);
	
	var _shiorijk2 = _interopRequireDefault(_shiorijk);
	
	var _shiori_transaction = __webpack_require__(94);
	
	var _events = __webpack_require__(96);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * The convenient SHIORI Shared Library Interface
	 */
	var Shiorif = function (_EventEmitter) {
	  (0, _inherits3.default)(Shiorif, _EventEmitter);
	
	  /**
	   * @param {Shiori} shiori - The instance of SHIORI Shared Library Interface
	   * @param {string} auto_convert_request_version - requests will be converted to this version
	   * @param {boolean} auto_adjust_to_response_charset - request charset header will be set to previous response charset
	   * @return {Shiorif} this
	   */
	  function Shiorif(shiori) {
	    var auto_convert_request_version = arguments.length <= 1 || arguments[1] === undefined ? '2.6' : arguments[1];
	    var auto_adjust_to_response_charset = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	    (0, _classCallCheck3.default)(this, Shiorif);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Shiorif).call(this));
	
	    _this._shiori = shiori;
	    _this.auto_convert_request_version = auto_convert_request_version;
	    _this.auto_adjust_to_response_charset = auto_adjust_to_response_charset;
	    _this._request_parser = new _shiorijk2.default.Shiori.Request.Parser();
	    _this._response_parser = new _shiorijk2.default.Shiori.Response.Parser();
	    return _this;
	  }
	
	  /**
	   * shiori
	   * @return {Shiori} shiori
	   */
	
	
	  (0, _createClass3.default)(Shiorif, [{
	    key: 'load',
	
	
	    /**
	     * SHIORI/2.x/3.x load()
	     *
	     * this emits load(dirpath), loaded(status) events.
	     * @param {string} dirpath - The directory that SHIORI Shared Library is placed. The end character of dirpath must be the path separator (/ or \\).
	     * @returns {Promise<number>} The status code
	     */
	    value: function load(dirpath) {
	      var _this2 = this;
	
	      this.emit('load', dirpath);
	      return this.shiori.load(dirpath).then(function (status) {
	        _this2.emit('loaded', status);
	        if (!status) throw new Shiorif.StatusError();
	        return status;
	      });
	    }
	
	    /**
	     * SHIORI/2.x/3.x request()
	     *
	     * this emits request(request), response(response) events.
	     * @param {string|ShioriJK.Message.Request} request - The SHIORI Request
	     * @param {boolean} convert - enable auto request version convert
	     * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
	     */
	
	  }, {
	    key: 'request',
	    value: function request(_request) {
	      var _this3 = this;
	
	      var convert = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	      var transaction = new _shiori_transaction.ShioriTransaction();
	      transaction.request = _request instanceof _shiorijk2.default.Message.Request ? _request : this._request_parser.parse(_request);
	      this.emit('request', transaction);
	      var use_request = convert ? transaction.request.to(this.auto_convert_request_version) : transaction.request;
	      for (var name in this.default_headers) {
	        if (use_request.headers.header[name] == null) {
	          use_request.headers.header[name] = this.default_headers[name];
	        }
	      }
	      if (this.auto_adjust_to_response_charset && this._last_response_charset) {
	        use_request.headers.header.Charset = this._last_response_charset;
	      }
	      return this.shiori.request(use_request.toString()).then(function (response) {
	        transaction.response = _this3._response_parser.parse(response);
	        _this3._last_response_charset = transaction.response.headers.header.Charset;
	        _this3.emit('response', transaction);
	        return transaction;
	      });
	    }
	
	    /**
	     * SHIORI/2.x/3.x request() by SHIORI/3.x request value
	     * @param {string} method - method
	     * @param {string} id - id
	     * @param {Object<string, string> | Array<string>} headers - headers
	     * @param {boolean} convert - enable auto request version convert
	     * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
	     */
	
	  }, {
	    key: 'request3',
	    value: function request3(method, id, headers) {
	      var convert = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
	
	      var request = new _shiorijk2.default.Message.Request({
	        request_line: {
	          version: '3.0',
	          method: method
	        },
	        headers: (0, _assign2.default)({ ID: id }, headers instanceof Array ? Shiorif.referencesFromArray(headers) : headers)
	      });
	      return this.request(request, convert);
	    }
	
	    /**
	     * SHIORI/2.x/3.x request() by SHIORI/2.x request value
	     * @param {string} method - method
	     * @param {Object<string, string>} headers - headers
	     * @param {boolean} convert - enable auto request version convert
	     * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
	     */
	
	  }, {
	    key: 'request2',
	    value: function request2(method, headers) {
	      var convert = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	      var request = new _shiorijk2.default.Message.Request({
	        request_line: {
	          version: '2.6',
	          method: method
	        },
	        headers: headers
	      });
	      return this.request(request, convert);
	    }
	
	    /**
	     * SHIORI/2.x/3.x request() by GET SHIORI/3.x request value
	     * @param {string} id - id
	     * @param {Object<string, string> | Array<string>} headers - headers
	     * @param {boolean} convert - enable auto request version convert
	     * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
	     */
	
	  }, {
	    key: 'get3',
	    value: function get3(id, headers) {
	      var convert = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	      return this.request3('GET', id, headers, convert);
	    }
	
	    /**
	     * SHIORI/2.x/3.x request() by NOTIFY SHIORI/3.x request value
	     * @param {string} id - id
	     * @param {Object<string, string> | Array<string>} headers - headers
	     * @param {boolean} convert - enable auto request version convert
	     * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
	     */
	
	  }, {
	    key: 'notify3',
	    value: function notify3(id, headers) {
	      var convert = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	      return this.request3('NOTIFY', id, headers, convert);
	    }
	
	    /**
	     * SHIORI/2.x/3.x unload()
	     *
	     * this emits unload(), unloaded(status) events.
	     * @returns {Promise<number>} The status code
	     */
	
	  }, {
	    key: 'unload',
	    value: function unload() {
	      var _this4 = this;
	
	      this.emit('unload');
	      return this.shiori.unload().then(function (status) {
	        _this4.emit('unloaded', status);
	        if (!status) throw new Shiorif.StatusError();
	        return status;
	      });
	    }
	
	    /**
	     * convert array values to Reference* hash
	     * @param {Array<string>} headersArray header array values
	     * @returns {Object<string, string>} The headers hash value
	     */
	
	  }, {
	    key: 'shiori',
	    get: function get() {
	      return this._shiori;
	    }
	
	    /**
	     * requests will be converted to this version
	     * @return {string} version
	     */
	
	  }, {
	    key: 'auto_convert_request_version',
	    get: function get() {
	      return this._auto_convert_request_version;
	    }
	
	    /**
	     * requests will be converted to this version
	     * @param {string} version - version
	     * @return {string} version
	     */
	    ,
	    set: function set(version) {
	      this._auto_convert_request_version = version;
	    }
	
	    /**
	     * request charset header will be set to previous response charset
	     * @return {boolean} enabled or not
	     */
	
	  }, {
	    key: 'auto_adjust_to_response_charset',
	    get: function get() {
	      return this._auto_adjust_to_response_charset;
	    }
	
	    /**
	     * request charset header will be set to previous response charset
	     * @param {boolean} enabled or not
	     * @return {boolean} enabled or not
	     */
	    ,
	    set: function set(enabled) {
	      this._auto_adjust_to_response_charset = enabled;
	    }
	
	    /**
	     * default headers
	     * @return {Object<string, string>} headers
	     */
	
	  }, {
	    key: 'default_headers',
	    get: function get() {
	      return this._default_headers;
	    }
	
	    /**
	     * default headers
	     * @param {Object<string, string>} headers - headers
	     * @return {Object<string, string>} headers
	     */
	    ,
	    set: function set(headers) {
	      this._default_headers = headers;
	    }
	  }], [{
	    key: 'referencesFromArray',
	    value: function referencesFromArray(headersArray) {
	      var headers = {};
	      headersArray.forEach(function (header, index) {
	        if (header != null) headers['Reference' + index] = header;
	      });
	      return headers;
	    }
	  }]);
	  return Shiorif;
	}(_events.EventEmitter);
	
	exports.Shiorif = Shiorif;
	
	
	Shiorif.StatusError = function (_Error) {
	  (0, _inherits3.default)(StatusError, _Error);
	
	  function StatusError() {
	    (0, _classCallCheck3.default)(this, StatusError);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(StatusError).apply(this, arguments));
	  }
	
	  return StatusError;
	}(Error);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	module.exports = __webpack_require__(6).Object.assign;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(4);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(19)});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(5)
	  , core      = __webpack_require__(6)
	  , ctx       = __webpack_require__(7)
	  , hide      = __webpack_require__(9)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 6 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(8);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(10)
	  , createDesc = __webpack_require__(18);
	module.exports = __webpack_require__(14) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(13)
	  , toPrimitive    = __webpack_require__(17)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(14) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(14) && !__webpack_require__(15)(function(){
	  return Object.defineProperty(__webpack_require__(16)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(15)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12)
	  , document = __webpack_require__(5).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(12);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(20)
	  , gOPS     = __webpack_require__(35)
	  , pIE      = __webpack_require__(36)
	  , toObject = __webpack_require__(37)
	  , IObject  = __webpack_require__(24)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(15)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(21)
	  , enumBugKeys = __webpack_require__(34);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(22)
	  , toIObject    = __webpack_require__(23)
	  , arrayIndexOf = __webpack_require__(27)(false)
	  , IE_PROTO     = __webpack_require__(31)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(24)
	  , defined = __webpack_require__(26);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(25);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(23)
	  , toLength  = __webpack_require__(28)
	  , toIndex   = __webpack_require__(30);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(29)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(32)('keys')
	  , uid    = __webpack_require__(33);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(5)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 35 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 36 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(26);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(39), __esModule: true };

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(40);
	module.exports = __webpack_require__(6).Object.getPrototypeOf;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(37)
	  , $getPrototypeOf = __webpack_require__(41);
	
	__webpack_require__(42)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(22)
	  , toObject    = __webpack_require__(37)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(4)
	  , core    = __webpack_require__(6)
	  , fails   = __webpack_require__(15);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(45);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(47);
	var $Object = __webpack_require__(6).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(4);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(14), 'Object', {defineProperty: __webpack_require__(10).f});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(49);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(50);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(69);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(51), __esModule: true };

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(52);
	__webpack_require__(64);
	module.exports = __webpack_require__(68).f('iterator');

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(53)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(54)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29)
	  , defined   = __webpack_require__(26);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(55)
	  , $export        = __webpack_require__(4)
	  , redefine       = __webpack_require__(56)
	  , hide           = __webpack_require__(9)
	  , has            = __webpack_require__(22)
	  , Iterators      = __webpack_require__(57)
	  , $iterCreate    = __webpack_require__(58)
	  , setToStringTag = __webpack_require__(62)
	  , getPrototypeOf = __webpack_require__(41)
	  , ITERATOR       = __webpack_require__(63)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(59)
	  , descriptor     = __webpack_require__(18)
	  , setToStringTag = __webpack_require__(62)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(9)(IteratorPrototype, __webpack_require__(63)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(11)
	  , dPs         = __webpack_require__(60)
	  , enumBugKeys = __webpack_require__(34)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(16)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(61).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(10)
	  , anObject = __webpack_require__(11)
	  , getKeys  = __webpack_require__(20);
	
	module.exports = __webpack_require__(14) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5).document && document.documentElement;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(10).f
	  , has = __webpack_require__(22)
	  , TAG = __webpack_require__(63)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(32)('wks')
	  , uid        = __webpack_require__(33)
	  , Symbol     = __webpack_require__(5).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(65);
	var global        = __webpack_require__(5)
	  , hide          = __webpack_require__(9)
	  , Iterators     = __webpack_require__(57)
	  , TO_STRING_TAG = __webpack_require__(63)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(66)
	  , step             = __webpack_require__(67)
	  , Iterators        = __webpack_require__(57)
	  , toIObject        = __webpack_require__(23);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(54)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(63);

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	__webpack_require__(80);
	__webpack_require__(81);
	__webpack_require__(82);
	module.exports = __webpack_require__(6).Symbol;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(5)
	  , has            = __webpack_require__(22)
	  , DESCRIPTORS    = __webpack_require__(14)
	  , $export        = __webpack_require__(4)
	  , redefine       = __webpack_require__(56)
	  , META           = __webpack_require__(72).KEY
	  , $fails         = __webpack_require__(15)
	  , shared         = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(62)
	  , uid            = __webpack_require__(33)
	  , wks            = __webpack_require__(63)
	  , wksExt         = __webpack_require__(68)
	  , wksDefine      = __webpack_require__(73)
	  , keyOf          = __webpack_require__(74)
	  , enumKeys       = __webpack_require__(75)
	  , isArray        = __webpack_require__(76)
	  , anObject       = __webpack_require__(11)
	  , toIObject      = __webpack_require__(23)
	  , toPrimitive    = __webpack_require__(17)
	  , createDesc     = __webpack_require__(18)
	  , _create        = __webpack_require__(59)
	  , gOPNExt        = __webpack_require__(77)
	  , $GOPD          = __webpack_require__(79)
	  , $DP            = __webpack_require__(10)
	  , $keys          = __webpack_require__(20)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(78).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(36).f  = $propertyIsEnumerable;
	  __webpack_require__(35).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(55)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(33)('meta')
	  , isObject = __webpack_require__(12)
	  , has      = __webpack_require__(22)
	  , setDesc  = __webpack_require__(10).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(15)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(5)
	  , core           = __webpack_require__(6)
	  , LIBRARY        = __webpack_require__(55)
	  , wksExt         = __webpack_require__(68)
	  , defineProperty = __webpack_require__(10).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(20)
	  , toIObject = __webpack_require__(23);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(20)
	  , gOPS    = __webpack_require__(35)
	  , pIE     = __webpack_require__(36);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(25);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(23)
	  , gOPN      = __webpack_require__(78).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(21)
	  , hiddenKeys = __webpack_require__(34).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(36)
	  , createDesc     = __webpack_require__(18)
	  , toIObject      = __webpack_require__(23)
	  , toPrimitive    = __webpack_require__(17)
	  , has            = __webpack_require__(22)
	  , IE8_DOM_DEFINE = __webpack_require__(13)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(14) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 80 */
/***/ function(module, exports) {



/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(73)('asyncIterator');

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(73)('observable');

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(84);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(88);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(49);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(86);
	module.exports = __webpack_require__(6).Object.setPrototypeOf;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(4);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(87).set});

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(12)
	  , anObject = __webpack_require__(11);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(7)(Function.call, __webpack_require__(79).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(90);
	var $Object = __webpack_require__(6).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(4)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(59)});

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(92)


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {
	/* (C) 2014 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2014 */
	var ShioriJK,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	ShioriJK = {};
	
	if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
	  module.exports = ShioriJK;
	}
	
	Function.prototype.property = function(properties) {
	  var descriptions, property, results1;
	  results1 = [];
	  for (property in properties) {
	    descriptions = properties[property];
	    results1.push(Object.defineProperty(this.prototype, property, descriptions));
	  }
	  return results1;
	};
	
	ShioriJK.Message = {};
	
	ShioriJK.Message.Request = (function() {
	  function Request(arg) {
	    var headers, no_prepare, ref, request_line;
	    ref = arg != null ? arg : {}, request_line = ref.request_line, headers = ref.headers, no_prepare = ref.no_prepare;
	    this.request_line = request_line != null ? request_line instanceof ShioriJK.RequestLine ? request_line : new ShioriJK.RequestLine(request_line) : !no_prepare ? new ShioriJK.RequestLine() : void 0;
	    this.headers = headers != null ? headers instanceof ShioriJK.Headers.Request ? headers : new ShioriJK.Headers.Request(headers) : new ShioriJK.Headers.Request();
	  }
	
	  Request.prototype.request_line = null;
	
	  Request.prototype.headers = null;
	
	  Request.prototype.toString = function() {
	    return this.request_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
	  };
	
	  return Request;
	
	})();
	
	ShioriJK.Message.Response = (function() {
	  function Response(arg) {
	    var headers, no_prepare, ref, status_line;
	    ref = arg != null ? arg : {}, status_line = ref.status_line, headers = ref.headers, no_prepare = ref.no_prepare;
	    this.status_line = status_line != null ? status_line instanceof ShioriJK.StatusLine ? status_line : new ShioriJK.StatusLine(status_line) : !no_prepare ? new ShioriJK.StatusLine() : void 0;
	    this.headers = headers != null ? headers instanceof ShioriJK.Headers.Response ? headers : new ShioriJK.Headers.Response(headers) : new ShioriJK.Headers.Response();
	  }
	
	  Response.prototype.status_line = null;
	
	  Response.prototype.headers = null;
	
	  Response.prototype.toString = function() {
	    return this.status_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
	  };
	
	  return Response;
	
	})();
	
	ShioriJK.RequestLine = (function() {
	  function RequestLine(arg) {
	    var method, protocol, ref, version;
	    ref = arg != null ? arg : {}, method = ref.method, protocol = ref.protocol, version = ref.version;
	    this["arguments"] = {};
	    if (method != null) {
	      this.method = method;
	    }
	    this.protocol = protocol || 'SHIORI';
	    if (version != null) {
	      this.version = version;
	    }
	  }
	
	  RequestLine.prototype.method = null;
	
	  RequestLine.prototype.protocol = null;
	
	  RequestLine.prototype.version = null;
	
	  RequestLine.property({
	    method: {
	      get: function() {
	        return this["arguments"].method;
	      },
	      set: function(method) {
	        if ((method != null) && (this.version != null)) {
	          this.validate_method_version(method, this.version);
	        } else if (method != null) {
	          switch (method) {
	            case 'GET':
	            case 'NOTIFY':
	            case 'GET Version':
	            case 'GET Sentence':
	            case 'GET Word':
	            case 'GET Status':
	            case 'TEACH':
	            case 'GET String':
	            case 'NOTIFY OwnerGhostName':
	            case 'NOTIFY OtherGhostName':
	            case 'TRANSLATE Sentence':
	              break;
	            default:
	              throw 'Invalid protocol method : ' + method;
	          }
	        }
	        return this["arguments"].method = method;
	      }
	    },
	    protocol: {
	      get: function() {
	        return this["arguments"].protocol;
	      },
	      set: function(protocol) {
	        if ((protocol != null) && protocol !== 'SHIORI') {
	          throw 'Invalid protocol : ' + protocol;
	        }
	        return this["arguments"].protocol = protocol;
	      }
	    },
	    version: {
	      get: function() {
	        return this["arguments"].version;
	      },
	      set: function(version) {
	        if ((this.method != null) && (version != null)) {
	          this.validate_method_version(this.method, version);
	        } else if (version != null) {
	          switch (version) {
	            case '2.0':
	            case '2.2':
	            case '2.3':
	            case '2.4':
	            case '2.5':
	            case '2.6':
	            case '3.0':
	              break;
	            default:
	              throw 'Invalid protocol version : ' + version;
	          }
	        }
	        return this["arguments"].version = version;
	      }
	    }
	  });
	
	  RequestLine.prototype.validate_method_version = function(method, version) {
	    var is_valid;
	    is_valid = false;
	    switch (version) {
	      case '2.0':
	        switch (method) {
	          case 'GET Version':
	          case 'NOTIFY OwnerGhostName':
	          case 'GET Sentence':
	          case 'GET Word':
	          case 'GET Status':
	            is_valid = true;
	        }
	        break;
	      case '2.2':
	        switch (method) {
	          case 'GET Sentence':
	            is_valid = true;
	        }
	        break;
	      case '2.3':
	        switch (method) {
	          case 'NOTIFY OtherGhostName':
	          case 'GET Sentence':
	            is_valid = true;
	        }
	        break;
	      case '2.4':
	        switch (method) {
	          case 'TEACH':
	            is_valid = true;
	        }
	        break;
	      case '2.5':
	        switch (method) {
	          case 'GET String':
	            is_valid = true;
	        }
	        break;
	      case '2.6':
	        switch (method) {
	          case 'GET Sentence':
	          case 'GET Status':
	          case 'GET String':
	          case 'NOTIFY OwnerGhostName':
	          case 'NOTIFY OtherGhostName':
	          case 'GET Version':
	          case 'TRANSLATE Sentence':
	            is_valid = true;
	        }
	        break;
	      case '3.0':
	        switch (method) {
	          case 'GET':
	          case 'NOTIFY':
	            is_valid = true;
	        }
	    }
	    if (!is_valid) {
	      throw 'Invalid protocol method and version : ' + method + ' SHIORI/' + version;
	    }
	  };
	
	  RequestLine.prototype.toString = function() {
	    return this.method + " " + this.protocol + "/" + this.version;
	  };
	
	  return RequestLine;
	
	})();
	
	ShioriJK.StatusLine = (function() {
	  function StatusLine(arg) {
	    var code, protocol, ref, version;
	    ref = arg != null ? arg : {}, code = ref.code, protocol = ref.protocol, version = ref.version;
	    this["arguments"] = {};
	    if (code != null) {
	      this.code = code;
	    }
	    this.protocol = protocol || 'SHIORI';
	    if (version != null) {
	      this.version = version;
	    }
	  }
	
	  StatusLine.prototype.code = null;
	
	  StatusLine.prototype.protocol = null;
	
	  StatusLine.prototype.version = null;
	
	  StatusLine.property({
	    code: {
	      get: function() {
	        return this["arguments"].code;
	      },
	      set: function(code) {
	        if ((code != null) && (this.message[code] == null)) {
	          throw 'Invalid response code : ' + code;
	        }
	        return this["arguments"].code = code;
	      }
	    },
	    protocol: {
	      get: function() {
	        return this["arguments"].protocol;
	      },
	      set: function(protocol) {
	        if ((protocol != null) && protocol !== 'SHIORI') {
	          throw 'Invalid protocol : ' + protocol;
	        }
	        return this["arguments"].protocol = protocol;
	      }
	    },
	    version: {
	      get: function() {
	        return this["arguments"].version;
	      },
	      set: function(version) {
	        if (version != null) {
	          switch (version) {
	            case '2.0':
	            case '2.2':
	            case '2.3':
	            case '2.4':
	            case '2.5':
	            case '2.6':
	            case '3.0':
	              break;
	            default:
	              throw 'Invalid protocol version : ' + version;
	          }
	        }
	        return this["arguments"].version = version;
	      }
	    }
	  });
	
	  StatusLine.prototype.toString = function() {
	    return this.protocol + "/" + this.version + " " + this.code + " " + this.message[this.code];
	  };
	
	  StatusLine.prototype.message = {
	    200: 'OK',
	    204: 'No Content',
	    310: 'Communicate',
	    311: 'Not Enough',
	    312: 'Advice',
	    400: 'Bad Request',
	    418: "I'm a tea pot",
	    500: 'Internal Server Error'
	  };
	
	  return StatusLine;
	
	})();
	
	ShioriJK.Headers = (function() {
	  function Headers(header) {
	    this.header = header != null ? header : {};
	  }
	
	  Headers.prototype.header = null;
	
	  Headers.prototype.get = function(name) {
	    if (this.header[name] != null) {
	      return this.header[name];
	    }
	  };
	
	  Headers.prototype.set = function(name, value) {
	    return this.header[name] = value;
	  };
	
	  Headers.prototype.get_separated = function(name, separator) {
	    if (separator == null) {
	      separator = '\x01';
	    }
	    if (this.header[name] != null) {
	      return this.header[name].split(separator);
	    }
	  };
	
	  Headers.prototype.set_separated = function(name, value, separator) {
	    if (separator == null) {
	      separator = '\x01';
	    }
	    return this.header[name] = value.join(separator);
	  };
	
	  Headers.prototype.get_separated2 = function(name, separator1, separator2) {
	    var element, i, len, ref, results1;
	    if (separator1 == null) {
	      separator1 = '\x02';
	    }
	    if (separator2 == null) {
	      separator2 = '\x01';
	    }
	    if (this.header[name] != null) {
	      ref = this.header[name].split(separator1);
	      results1 = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        element = ref[i];
	        results1.push(element.split(separator2));
	      }
	      return results1;
	    }
	  };
	
	  Headers.prototype.set_separated2 = function(name, value, separator1, separator2) {
	    var element;
	    if (separator1 == null) {
	      separator1 = '\x02';
	    }
	    if (separator2 == null) {
	      separator2 = '\x01';
	    }
	    return this.header[name] = ((function() {
	      var i, len, results1;
	      results1 = [];
	      for (i = 0, len = value.length; i < len; i++) {
	        element = value[i];
	        results1.push(element.join(separator2));
	      }
	      return results1;
	    })()).join(separator1);
	  };
	
	  Headers.prototype.validate = function() {
	    var name, ref, results1, value;
	    ref = this.header;
	    results1 = [];
	    for (name in ref) {
	      value = ref[name];
	      if (value.match(/\n/)) {
	        throw 'Invalid header value - line feed found : [' + name + '] : ' + value;
	      } else {
	        results1.push(void 0);
	      }
	    }
	    return results1;
	  };
	
	  Headers.prototype.toString = function() {
	    var name, ref, str, value;
	    str = '';
	    this.validate();
	    ref = this.header;
	    for (name in ref) {
	      value = ref[name];
	      str += name + ": " + value + "\r\n";
	    }
	    return str;
	  };
	
	  return Headers;
	
	})();
	
	ShioriJK.Headers.Request = (function(superClass) {
	  extend(Request, superClass);
	
	  function Request() {
	    return Request.__super__.constructor.apply(this, arguments);
	  }
	
	  return Request;
	
	})(ShioriJK.Headers);
	
	ShioriJK.Headers.Response = (function(superClass) {
	  extend(Response, superClass);
	
	  function Response() {
	    return Response.__super__.constructor.apply(this, arguments);
	  }
	
	  return Response;
	
	})(ShioriJK.Headers);
	
	ShioriJK.Shiori = {};
	
	ShioriJK.Shiori.Header = {};
	
	ShioriJK.Shiori.Request = {};
	
	ShioriJK.Shiori.Request.RequestLine = {};
	
	ShioriJK.Shiori.Request.Header = {};
	
	ShioriJK.Shiori.Response = {};
	
	ShioriJK.Shiori.Response.StatusLine = {};
	
	ShioriJK.Shiori.Response.Header = {};
	
	ShioriJK.Shiori.Parser = (function() {
	  function Parser() {}
	
	  Parser.prototype.is_parsing = function() {
	    return !this.section.is('idle');
	  };
	
	  Parser.prototype.is_parsing_end = function() {
	    return !this.section.is('end');
	  };
	
	  Parser.prototype.get_result = function() {
	    return this.result;
	  };
	
	  Parser.prototype.result_builder = function() {};
	
	  Parser.prototype.begin_parse = function() {
	    if (!this.section.is('idle')) {
	      throw 'cannot begin parsing because previous transaction is still working';
	    }
	    this.result = this.result_builder();
	    return this.section.next();
	  };
	
	  Parser.prototype.end_parse = function() {
	    if (!this.section.is('end')) {
	      this.abort_parse();
	      throw 'parsing was aborted';
	    }
	    return this.section.next();
	  };
	
	  Parser.prototype.abort_parse = function() {
	    var name, parser, ref;
	    if (this.parsers != null) {
	      ref = this.parsers;
	      for (name in ref) {
	        parser = ref[name];
	        if (parser.abort_parse != null) {
	          parser.abort_parse();
	        }
	      }
	    }
	    return this.section.set('idle');
	  };
	
	  Parser.prototype.parse = function(transaction) {
	    var result;
	    this.begin_parse();
	    result = this.parse_chunk(transaction);
	    if (this.is_parsing()) {
	      throw 'transaction is not closed';
	    }
	    if (result.results.length !== 1) {
	      throw 'multiple transaction';
	    }
	    return result.results[0];
	  };
	
	  Parser.prototype.parse_chunk = function(chunk) {
	    var lines;
	    lines = chunk.split(/\r\n/);
	    if (chunk.match(/\r\n$/)) {
	      lines.pop();
	    }
	    return this.parse_lines(lines);
	  };
	
	  Parser.prototype.parse_lines = function(lines) {
	    var i, len, line, result, results;
	    results = [];
	    for (i = 0, len = lines.length; i < len; i++) {
	      line = lines[i];
	      result = this.parse_line(line);
	      if (result.state === 'end') {
	        results.push(result.result);
	      }
	    }
	    return {
	      results: results,
	      state: result.state
	    };
	  };
	
	  Parser.prototype.parse_line = function(line) {
	    if (this.section.is('idle')) {
	      this.begin_parse();
	    }
	    this.parse_main(line);
	    if (this.section.is('end')) {
	      this.end_parse();
	      return {
	        result: this.get_result(),
	        state: 'end'
	      };
	    } else {
	      return {
	        state: 'continue'
	      };
	    }
	  };
	
	  Parser.prototype.parse_main = function(line) {};
	
	  return Parser;
	
	})();
	
	ShioriJK.Shiori.Section = (function() {
	  function Section(sections) {
	    this.sections = sections;
	    this.index = 0;
	  }
	
	  Section.prototype.is = function(section) {
	    return this.sections[this.index] === section;
	  };
	
	  Section.prototype.next = function() {
	    if (this.index === this.sections.length - 1) {
	      return this.index = 0;
	    } else {
	      return this.index++;
	    }
	  };
	
	  Section.prototype.previous = function() {
	    if (this.index === 0) {
	      return this.index = this.sections.length - 1;
	    } else {
	      return this.index--;
	    }
	  };
	
	  Section.prototype.set = function(section) {
	    return this.index = this.sections.indexOf(section);
	  };
	
	  Section.prototype.get = function() {
	    return this.sections[this.index];
	  };
	
	  return Section;
	
	})();
	
	ShioriJK.Shiori.Header.Parser = (function(superClass) {
	  extend(Parser, superClass);
	
	  function Parser() {
	    return Parser.__super__.constructor.apply(this, arguments);
	  }
	
	  Parser.prototype.parse_main = function(line) {
	    var result;
	    result = this.parse_header(line);
	    if (result.state === 'end') {
	      return this.section.next();
	    }
	  };
	
	  Parser.prototype.parse_header = function(line) {
	    var result;
	    if (line.length) {
	      if (result = line.match(/^(.+?): (.*)$/)) {
	        this.result.header[result[1]] = result[2];
	      } else {
	        throw 'Invalid header line : ' + line;
	      }
	      return {
	        state: 'continue'
	      };
	    } else {
	      return {
	        state: 'end'
	      };
	    }
	  };
	
	  return Parser;
	
	})(ShioriJK.Shiori.Parser);
	
	ShioriJK.Shiori.Header.Section = (function(superClass) {
	  extend(Section, superClass);
	
	  function Section(sections) {
	    this.sections = sections != null ? sections : ['idle', 'header', 'end'];
	    this.index = 0;
	  }
	
	  return Section;
	
	})(ShioriJK.Shiori.Section);
	
	ShioriJK.Shiori.Request.Parser = (function(superClass) {
	  extend(Parser, superClass);
	
	  function Parser() {
	    this.parsers = {
	      request_line: new ShioriJK.Shiori.Request.RequestLine.Parser(),
	      headers: new ShioriJK.Shiori.Request.Header.Parser()
	    };
	    this.section = new ShioriJK.Shiori.Request.Section();
	  }
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.Message.Request({
	      no_prepare: true
	    });
	  };
	
	  Parser.prototype.parse_main = function(line) {
	    var parser, parser_result;
	    parser = this.parsers[this.section.get()];
	    parser_result = parser.parse_line(line);
	    if (parser_result.state === 'end') {
	      this.result[this.section.get()] = parser_result.result;
	      return this.section.next();
	    }
	  };
	
	  return Parser;
	
	})(ShioriJK.Shiori.Parser);
	
	ShioriJK.Shiori.Request.RequestLine.Parser = (function() {
	  function Parser() {}
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.RequestLine();
	  };
	
	  Parser.prototype.parse = function(transaction) {
	    return this.parse_chunk(transaction);
	  };
	
	  Parser.prototype.parse_chunk = function(chunk) {
	    return this.parse_line(chunk);
	  };
	
	  Parser.prototype.parse_line = function(line) {
	    var result;
	    result = line.match(/^([A-Za-z0-9 ]+) SHIORI\/([0-9.]+)/);
	    if (!result) {
	      throw 'Invalid request line : ' + line;
	    }
	    this.result = this.result_builder();
	    this.result.method = result[1];
	    this.result.protocol = 'SHIORI';
	    this.result.version = result[2];
	    return {
	      result: this.result,
	      state: 'end'
	    };
	  };
	
	  return Parser;
	
	})();
	
	ShioriJK.Shiori.Request.Header.Parser = (function(superClass) {
	  extend(Parser, superClass);
	
	  function Parser() {
	    this.section = new ShioriJK.Shiori.Request.Header.Section();
	  }
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.Headers.Request();
	  };
	
	  return Parser;
	
	})(ShioriJK.Shiori.Header.Parser);
	
	ShioriJK.Shiori.Request.Section = (function(superClass) {
	  extend(Section, superClass);
	
	  function Section(sections) {
	    this.sections = sections != null ? sections : ['idle', 'request_line', 'headers', 'end'];
	    this.index = 0;
	  }
	
	  return Section;
	
	})(ShioriJK.Shiori.Section);
	
	ShioriJK.Shiori.Request.Header.Section = (function(superClass) {
	  extend(Section, superClass);
	
	  function Section() {
	    return Section.__super__.constructor.apply(this, arguments);
	  }
	
	  return Section;
	
	})(ShioriJK.Shiori.Header.Section);
	
	ShioriJK.Shiori.Response.Parser = (function(superClass) {
	  extend(Parser, superClass);
	
	  function Parser() {
	    this.parsers = {
	      status_line: new ShioriJK.Shiori.Response.StatusLine.Parser(),
	      headers: new ShioriJK.Shiori.Response.Header.Parser()
	    };
	    this.section = new ShioriJK.Shiori.Response.Section();
	  }
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.Message.Response({
	      no_prepare: true
	    });
	  };
	
	  Parser.prototype.parse_main = function(line) {
	    var parser, parser_result;
	    parser = this.parsers[this.section.get()];
	    parser_result = parser.parse_line(line);
	    if (parser_result.state === 'end') {
	      this.result[this.section.get()] = parser_result.result;
	      return this.section.next();
	    }
	  };
	
	  return Parser;
	
	})(ShioriJK.Shiori.Parser);
	
	ShioriJK.Shiori.Response.StatusLine.Parser = (function() {
	  function Parser() {}
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.StatusLine();
	  };
	
	  Parser.prototype.parse = function(transaction) {
	    return this.parse_chunk(transaction);
	  };
	
	  Parser.prototype.parse_chunk = function(chunk) {
	    return this.parse_line(chunk);
	  };
	
	  Parser.prototype.parse_line = function(line) {
	    var result;
	    result = line.match(/^SHIORI\/([0-9.]+) (\d+) (.+)$/);
	    if (!result) {
	      throw 'Invalid status line : ' + line;
	    }
	    this.result = this.result_builder();
	    this.result.protocol = 'SHIORI';
	    this.result.version = result[1];
	    this.result.code = result[2] - 0;
	    return {
	      result: this.result,
	      state: 'end'
	    };
	  };
	
	  return Parser;
	
	})();
	
	ShioriJK.Shiori.Response.Header.Parser = (function(superClass) {
	  extend(Parser, superClass);
	
	  function Parser() {
	    this.section = new ShioriJK.Shiori.Response.Header.Section();
	  }
	
	  Parser.prototype.result_builder = function() {
	    return new ShioriJK.Headers.Response();
	  };
	
	  return Parser;
	
	})(ShioriJK.Shiori.Header.Parser);
	
	ShioriJK.Shiori.Response.Section = (function(superClass) {
	  extend(Section, superClass);
	
	  function Section(sections) {
	    this.sections = sections != null ? sections : ['idle', 'status_line', 'headers', 'end'];
	    this.index = 0;
	  }
	
	  return Section;
	
	})(ShioriJK.Shiori.Section);
	
	ShioriJK.Shiori.Response.Header.Section = (function(superClass) {
	  extend(Section, superClass);
	
	  function Section() {
	    return Section.__super__.constructor.apply(this, arguments);
	  }
	
	  return Section;
	
	})(ShioriJK.Shiori.Header.Section);
	
	//# sourceMappingURL=shiorijk.js.map
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(93)(module)))

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	if(false) var exports = window;
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	if (true) {
	  var ShioriConverter = __webpack_require__(95).ShioriConverter;
	}
	
	/**
	 * SHIORI/2.x/3.x transaction class with protocol version converter
	 */
	
	var ShioriTransaction = (function () {
	  /**
	   * constructor
	   * @return {ShioriTransaction} this
	   */
	
	  function ShioriTransaction() {
	    _classCallCheck(this, ShioriTransaction);
	  }
	
	  /**
	   * request
	   * @return {ShioriJK.Message.Request} request
	   */
	
	  _createClass(ShioriTransaction, [{
	    key: 'request_to',
	
	    /**
	     * convert request to specified protocol version
	     * (this method needs ShioriConverter)
	     * @param {string} version - target protocol version
	     * @return {ShioriJK.Message.Request} specified version request
	     */
	    value: function request_to(version) {
	      return ShioriConverter.request_to(this.request, version);
	    }
	
	    /**
	     * convert response to specified protocol version
	     * (this method needs ShioriConverter)
	     * @param {string} version - target protocol version
	     * @return {ShioriJK.Message.Response} specified version response
	     */
	
	  }, {
	    key: 'response_to',
	    value: function response_to(version) {
	      return ShioriConverter.response_to(this.request, this.response, version);
	    }
	  }, {
	    key: 'request',
	    get: function get() {
	      return this._request;
	    }
	
	    /**
	     * request
	     * @param {ShioriJK.Message.Request} request - request
	     * @return {ShioriJK.Message.Request} request
	     */
	    ,
	    set: function set(request) {
	      this._request = request;
	      this._request.to = this.request_to.bind(this);
	      return this._request;
	    }
	
	    /**
	     * response
	     * @return {ShioriJK.Message.Response} response
	     */
	
	  }, {
	    key: 'response',
	    get: function get() {
	      return this._response;
	    }
	
	    /**
	     * response
	     * @param {ShioriJK.Message.Response} response - response
	     * @return {ShioriJK.Message.Response} response
	     */
	    ,
	    set: function set(response) {
	      this._response = response;
	      this._response.to = this.response_to.bind(this);
	      return this._response;
	    }
	  }]);
	
	  return ShioriTransaction;
	})();
	
	exports.ShioriTransaction = ShioriTransaction;
	//# sourceMappingURL=shiori_transaction.js.map


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}if(false)var exports=window;var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}();if(Object.defineProperty(exports,"__esModule",{value:!0}),"undefined"!="function")var ShioriJK=__webpack_require__(91);var ShioriConverter=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"request_to",value:function(r,t){if(!r)throw new e.RequestNotSetError;return"4.0"===r.request_line.version?"4.0"===t?r:"3.0"===t?e.request_4to3(r):e.request_4to2(r):"3.0"===r.request_line.version?"4.0"===t?e.request_3to4(r):"3.0"===t?r:e.request_3to2(r):"4.0"===t?e.request_2to4(r):"3.0"===t?e.request_2to3(r):r}},{key:"response_to",value:function(r,t,o){if(!r)throw new e.RequestNotSetError;if(!t)throw new e.ResponseNotSetError;return"4.0"===t.status_line.version?"4.0"===o?t:"3.0"===o?e.response_4to3(r,t):e.response_4to2(r,t):"3.0"===t.status_line.version?"4.0"===o?e.response_3to4(r,t):"3.0"===o?t:e.response_3to2(r,t):"4.0"===o?e.response_2to4(r,t):"3.0"===o?e.response_2to3(r,t):t}},{key:"request_4to3",value:function(r){throw new e.NotImplementedError}},{key:"request_4to2",value:function(r){return e.request_3to2(e.request_4to3(r))}},{key:"method3to2",value:function(e){var r=e.headers.header.ID;return"version"===r?"GET Version":"OnTeach"===r?"TEACH":"ownerghostname"===r?"NOTIFY OwnerGhostName":"otherghostname"===r?"NOTIFY OtherGhostName":"NOTIFY"===e.request_line.method?void 0:r.match(/^[a-z]/)?"GET String":"GET Sentence"}},{key:"request_3to2",value:function(r){var t=e.method3to2(r);if(t){var o=r.headers.header.ID,n=new ShioriJK.Headers.Request,s=new ShioriJK.Message.Request({request_line:new ShioriJK.RequestLine({method:t,protocol:r.protocol,version:"2.6"}),headers:n});if("GET Sentence"===t&&null!=o){if("OnCommunicate"===o){n.header.Sender=r.headers.header.Reference0,n.header.Sentence=r.headers.header.Reference1,n.header.Age=r.headers.header.Age||"0";for(var a in r.headers.header){var i=r.headers.header[a],u=void 0;(u=a.match(/^Reference(\d+)$/))?n.header["Reference"+(u[1]-2)]=""+i:n.header[a]=""+i}return s}n.header.Event=o}else{if("GET String"!==t||null==o){if("TEACH"===t){n.header.Word=r.headers.header.Reference0;for(var a in r.headers.header){var i=r.headers.header[a],u=void 0;(u=a.match(/^Reference(\d+)$/))?n.header["Reference"+(u[1]-1)]=""+i:n.header[a]=""+i}return s}if("NOTIFY OwnerGhostName"===t)return n.header.Ghost=r.headers.header.Reference0,s;if("NOTIFY OtherGhostName"===t){var h=[];for(var a in r.headers.header){var i=r.headers.header[a];a.match(/^Reference\d+$/)?h.push(""+i):n.header[a]=""+i}var c=h.map(function(e){return"GhostEx: "+e+"\r\n"}).join("");return s.request_line+"\r\n"+s.headers+c+"\r\n"}return}n.header.ID=o}for(var a in r.headers.header)if("ID"!==a){var i=r.headers.header[a];n.header[a]=""+i}return s}}},{key:"request_2to3",value:function(r){throw new e.NotImplementedError}},{key:"request_3to4",value:function(r){throw new e.NotImplementedError}},{key:"request_2to4",value:function(r){return e.request_3to4(e.request_2to3(r))}},{key:"response_4to3",value:function(r,t){throw new e.NotImplementedError}},{key:"response_4to2",value:function(r,t){return e.response_3to2(e.response_4to3(r,t))}},{key:"response_3to2",value:function(r,t){throw new e.NotImplementedError}},{key:"response_2to3",value:function(r,t){var o=e.request_to(r,"2.6"),n=void 0;switch(o.request_line.method){case"GET String":n="String";break;case"GET Word":n="Word";break;case"GET Status":n="Status";break;default:n="Sentence"}var s=new ShioriJK.Headers.Response;null!=t.headers.header[n]&&(s.header.Value=t.headers.header[n]);for(var a in t.headers.header){var i=t.headers.header[a],u=void 0;(u=a.match(/^Reference(\d+)$/))?s.header["Reference"+(u[1]+1)]=i:"To"===a?s.header.Reference0=i:a!==n&&(s.header[a]=i)}return new ShioriJK.Message.Response({status_line:new ShioriJK.StatusLine({code:t.status_line.code,protocol:t.status_line.protocol,version:"3.0"}),headers:s})}},{key:"response_3to4",value:function(r,t){throw new e.NotImplementedError}},{key:"response_2to4",value:function(r,t){return e.response_3to4(e.response_2to3(r,t))}}]),e}();ShioriConverter.RequestNotSetError=function(e){function r(){return _classCallCheck(this,r),_possibleConstructorReturn(this,Object.getPrototypeOf(r).apply(this,arguments))}return _inherits(r,e),r}(Error),ShioriConverter.ResponseNotSetError=function(e){function r(){return _classCallCheck(this,r),_possibleConstructorReturn(this,Object.getPrototypeOf(r).apply(this,arguments))}return _inherits(r,e),r}(Error),ShioriConverter.NotImplementedError=function(e){function r(){return _classCallCheck(this,r),_possibleConstructorReturn(this,Object.getPrototypeOf(r).apply(this,arguments))}return _inherits(r,e),r}(Error),exports.ShioriConverter=ShioriConverter;
	//# sourceMappingURL=shiori_converter.js.map


/***/ },
/* 96 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=shiorif.js.map