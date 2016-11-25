import {EventEmitter} from "events";
import {ShioriConverter} from "shiori_converter";
import {ShioriTransaction} from "shiori_transaction";
import * as ShioriJK from "shiorijk";
import {Shiori} from "shioriloader";

/** The convenient SHIORI Shared Library Interface */
export class Shiorif extends EventEmitter {
  /**
   * convert array values to Reference* hash
   * @param headersArray header array values
   * @return headers hash
   */
  static referencesFromArray(headersArray: string[]) {
    const headers: {[name: string]: string} = {};
    headersArray.forEach((header, index) => {
      if (header != null) headers[`Reference${index}`] = header;
    });
    return headers;
  }

  private readonly _shiori: Shiori;
  private readonly _requestParser: ShioriJK.Shiori.Request.Parser;
  private readonly _responseParser: ShioriJK.Shiori.Response.Parser;
  private _autoConvertRequestVersion: ShioriConverter.ShioriVersion;
  private _autoAdjustToResponseCharset: boolean;
  private _defaultHeaders: {[name: string]: string};
  private _lastResponseCharset: string;

  /**
   * @param shiori The instance of SHIORI Shared Library Interface
   * @param autoConvertRequestVersion requests will be converted to this version
   * @param autoAdjustToResponseCharset request charset header will be set to previous response charset
   * @param defaultHeaders default headers
   */
  constructor(
    shiori: Shiori,
    autoConvertRequestVersion: ShioriConverter.ShioriVersion = "2.6",
    autoAdjustToResponseCharset = false,
    defaultHeaders: {[name: string]: string} = {},
  ) {
    super();
    this._shiori = shiori;
    this.autoConvertRequestVersion = autoConvertRequestVersion;
    this.autoAdjustToResponseCharset = autoAdjustToResponseCharset;
    this._defaultHeaders = defaultHeaders;
    this._requestParser = new ShioriJK.Shiori.Request.Parser();
    this._responseParser = new ShioriJK.Shiori.Response.Parser();
  }

  /** shiori */
  get shiori() {
    return this._shiori;
  }

  /** requests will be converted to this version */
  get autoConvertRequestVersion() {
    return this._autoConvertRequestVersion;
  }

  /** requests will be converted to this version */
  set autoConvertRequestVersion(version) {
    this._autoConvertRequestVersion = version;
  }

  /** request charset header will be set to previous response charset */
  get autoAdjustToResponseCharset() {
    return this._autoAdjustToResponseCharset;
  }

  /** request charset header will be set to previous response charset */
  set autoAdjustToResponseCharset(enabled) {
    this._autoAdjustToResponseCharset = enabled;
  }

  /** default headers */
  get defaultHeaders() {
    return this._defaultHeaders;
  }

  /** default headers */
  set defaultHeaders(headers) {
    this._defaultHeaders = headers;
  }

  /**
   * SHIORI/2.x/3.x load()
   *
   * this emits load(dirpath), loaded(status) events.
   * @param dirpath The directory that SHIORI Shared Library is placed.
   *                The end character of dirpath must be the path separator (/ or \\).
   * @return The status code
   */
  load(dirpath: string) {
    this.emit("load", dirpath);
    return this.shiori.load(dirpath).then((status) => {
      this.emit("loaded", status);
      if (!status) throw new Shiorif.StatusError();
      return status;
    });
  }

  /**
   * SHIORI/2.x/3.x request()
   *
   * this emits request(request), response(response) events.
   * @param request The SHIORI Request
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  request(request: string | ShioriJK.Message.Request, convert = true) {
    const transaction = new ShioriTransaction();
    transaction.setRequest(
      request instanceof ShioriJK.Message.Request ? request : this._requestParser.parse(request),
    );
    this.emit("request", transaction);
    const useRequest = convert
      ? transaction.request.to(this.autoConvertRequestVersion)
      : transaction.request;
    for (const name in this.defaultHeaders) {
      if (useRequest.headers.header[name] == null) {
        useRequest.headers.header[name] = this.defaultHeaders[name];
      }
    }
    if (this.autoAdjustToResponseCharset && this._lastResponseCharset) {
      useRequest.headers.header["Charset"] = this._lastResponseCharset;
    }
    return this.shiori.request(useRequest.toString())
      .then((response) => {
        transaction.setResponse(this._responseParser.parse(response));
        this._lastResponseCharset = transaction.response.headers.header["Charset"];
        this.emit("response", transaction);
        return transaction;
      });
  }

  /**
   * SHIORI/2.x/3.x request() by SHIORI/3.x request value
   * @param method method
   * @param id id
   * @param headers headers
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  request3(method: string, id: string, headers?: {[name: string]: string} | string[], convert = true) {
    const request = new ShioriJK.Message.Request({
      request_line: {
        version: "3.0",
        method,
      },
      headers: Object.assign({ID: id}, headers instanceof Array ? Shiorif.referencesFromArray(headers) : headers),
    });
    return this.request(request, convert);
  }

  /**
   * SHIORI/2.x/3.x request() by SHIORI/2.x request value
   * @param method method
   * @param headers headers
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  request2(method: string, headers?: {[name: string]: string} | string[], convert = true) {
    const request = new ShioriJK.Message.Request({
      request_line: {
        version: "2.6",
        method,
      },
      headers: headers instanceof Array ? Shiorif.referencesFromArray(headers) : headers,
    });
    return this.request(request, convert);
  }

  /**
   * SHIORI/2.x/3.x request() by GET SHIORI/3.x request value
   * @param id id
   * @param headers headers
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  get3(id: string, headers?: {[name: string]: string} | string[], convert = true) {
    return this.request3("GET", id, headers, convert);
  }

  /**
   * SHIORI/2.x/3.x request() by NOTIFY SHIORI/3.x request value
   * @param id id
   * @param headers headers
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  notify3(id: string, headers?: {[name: string]: string} | string[], convert = true) {
    return this.request3("NOTIFY", id, headers, convert);
  }

  /**
   * SHIORI/2.x request() by GET Version SHIORI/2.x request value
   * @param headers headers
   * @param convert enable auto request version convert
   * @return The SHIORI request transaction
   */
  getVersion2(headers?: {[name: string]: string} | string[], convert = true) {
    return this.request2("GET Version", headers, convert);
  }

  /**
   * SHIORI/2.x/3.x unload()
   *
   * this emits unload(), unloaded(status) events.
   * @return The status code
   */
  unload() {
    this.emit("unload");
    return this.shiori.unload().then((status) => {
      this.emit("unloaded", status);
      if (!status) throw new Shiorif.StatusError();
      return status;
    });
  }
}

export namespace Shiorif {
  /** load() / unload() status error */
  export class StatusError extends Error {
  };
}
