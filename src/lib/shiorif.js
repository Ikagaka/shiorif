import ShioriJK from 'shiorijk';
import {ShioriTransaction} from 'shiori_transaction';
import {EventEmitter} from 'events';

/**
 * The convenient SHIORI Shared Library Interface
 */
export class Shiorif extends EventEmitter {
  /**
   * @param {Shiori} shiori - The instance of SHIORI Shared Library Interface
   * @param {string} auto_convert_request_version - requests will be converted to this version
   * @return {Shiorif} this
   */
  constructor(shiori, auto_convert_request_version = '2.6') {
    super();
    this._shiori = shiori;
    this.auto_convert_request_version = auto_convert_request_version;
    this._request_parser = new ShioriJK.Shiori.Request.Parser();
    this._response_parser = new ShioriJK.Shiori.Response.Parser();
  }

  /**
   * shiori
   * @return {Shiori} shiori
   */
  get shiori() {
    return this._shiori;
  }

  /**
   * requests will be converted to this version
   * @return {string} version
   */
  get auto_convert_request_version() {
    return this._auto_convert_request_version;
  }

  /**
   * requests will be converted to this version
   * @param {string} version - version
   * @return {string} version
   */
  set auto_convert_request_version(version) {
    this._auto_convert_request_version = version;
  }

  /**
   * default headers
   * @return {Object<string, string>} headers
   */
  get default_headers() {
    return this._default_headers;
  }

  /**
   * default headers
   * @param {Object<string, string>} headers - headers
   * @return {Object<string, string>} headers
   */
  set default_headers(headers) {
    this._default_headers = headers;
  }

  /**
   * SHIORI/2.x/3.x load()
   *
   * this emits load(dirpath), loaded(status) events.
   * @param {string} dirpath - The directory that SHIORI Shared Library is placed. The end character of dirpath must be the path separator (/ or \\).
   * @returns {Promise<number>} The status code
   */
  load(dirpath) {
    this.emit('load', dirpath);
    return this.shiori.load(dirpath).then((status) => {
      this.emit('loaded', status);
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
  request(request, convert = true) {
    const transaction = new ShioriTransaction();
    transaction.request = request instanceof ShioriJK.Message.Request
      ? request : this._request_parser.parse(request);
    this.emit('request', transaction);
    const use_request = convert
      ? transaction.request.to(this.auto_convert_request_version)
      : transaction.request;
    for (const name in this.default_headers) {
      if (use_request.headers.header[name] != null) {
        use_request.headers.header[name] = this.default_headers[name];
      }
    }
    return this.shiori.request(use_request.toString())
      .then((response) => {
        transaction.response = this._response_parser.parse(response);
        this.emit('response', transaction);
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
  request3(method, id, headers, convert = true) {
    const request = new ShioriJK.Message.Request({
      request_line: {
        version: '3.0',
        method: method,
      },
      headers: Object.assign({ID: id}, headers instanceof Array ? Shiorif.referencesFromArray(headers) : headers),
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
  request2(method, headers, convert = true) {
    const request = new ShioriJK.Message.Request({
      request_line: {
        version: '2.6',
        method: method,
      },
      headers: headers,
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
  get3(id, headers, convert = true) {
    return this.request3('GET', id, headers, convert);
  }

  /**
   * SHIORI/2.x/3.x request() by NOTIFY SHIORI/3.x request value
   * @param {string} id - id
   * @param {Object<string, string> | Array<string>} headers - headers
   * @param {boolean} convert - enable auto request version convert
   * @returns {Promise<ShioriTransaction>} The SHIORI request transaction
   */
  notify3(id, headers, convert = true) {
    return this.request3('NOTIFY', id, headers, convert);
  }

  /**
   * SHIORI/2.x/3.x unload()
   *
   * this emits unload(), unloaded(status) events.
   * @returns {Promise<number>} The status code
   */
  unload() {
    this.emit('unload');
    return this.shiori.unload().then((status) => {
      this.emit('unloaded', status);
      if (!status) throw new Shiorif.StatusError();
      return status;
    });
  }

  /**
   * convert array values to Reference* hash
   * @param {Array<string>} headersArray header array values
   * @returns {Object<string, string>} The headers hash value
   */
  static referencesFromArray(headersArray) {
    const headers = {};
    headersArray.forEach((header, index) => {
      if (header != null) headers[`Reference${index}`] = header;
    });
    return headers;
  }
}

Shiorif.StatusError = class StatusError extends Error {
};
