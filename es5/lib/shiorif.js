'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shiorif = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _shiorijk = require('shiorijk');

var _shiorijk2 = _interopRequireDefault(_shiorijk);

var _shiori_transaction = require('shiori_transaction');

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The convenient SHIORI Shared Library Interface
 */
var Shiorif = function (_EventEmitter) {
  (0, _inherits3.default)(Shiorif, _EventEmitter);

  /**
   * @param {Shiori} shiori - The instance of SHIORI Shared Library Interface
   * @param {string} auto_convert_request_version - requests will be converted to this version
   * @return {Shiorif} this
   */
  function Shiorif(shiori) {
    var auto_convert_request_version = arguments.length <= 1 || arguments[1] === undefined ? '2.6' : arguments[1];
    (0, _classCallCheck3.default)(this, Shiorif);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Shiorif).call(this));

    _this._shiori = shiori;
    _this.auto_convert_request_version = auto_convert_request_version;
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
      return this.shiori.request(use_request.toString()).then(function (response) {
        transaction.response = _this3._response_parser.parse(response);
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
//# sourceMappingURL=shiorif.js.map
