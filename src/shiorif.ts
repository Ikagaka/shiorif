/* for browser */
declare var require;
if (typeof require === "undefined") require = function(){};
declare var exports;
if (typeof exports === "undefined") exports = {};

import shiorijk = require('shiorijk');
if(shiorijk) var ShioriJK = shiorijk;
import eventemitter2 = require('eventemitter2');
if (eventemitter2) var EventEmitter2 = eventemitter2.EventEmitter2;

/**
 * The convenient SHIORI Shared Library Interface
 */
export class Shiorif extends EventEmitter2 {
  /**
   * @param shiori The instance of SHIORI Shared Library Interface
   */
  constructor(private shiori: Shiori) {
    super({ maxListeners: 0 });
  }

  /**
   * SHIORI/2.x/3.x load()
   * 
   * this emits load(dirpath), loaded(status), load:completed(status) events.
   * @param dirpath The directory that SHIORI Shared Library is placed. The end character of dirpath must be the path separator (/ or \\).
   * @returns The status code
   */
  load(dirpath: string): Shiorif.Transaction<number> {
    this.emit("load", dirpath);
    return <Shiorif.Transaction<number>> this.shiori.load(dirpath).then((status) => {
      this.emit("loaded", status);
      return new Shiorif.Transaction<number>(this, ["load:completed"], status, (resolve, reject) => status ? resolve(status) : reject(new Error("load status is false")));
    });
  }

  /**
   * SHIORI/2.x/3.x request()
   * 
   * this emits request(request), response(response), request:completed(response), request:{ID}(request), response:{ID}(response), request:{ID}:completed(response) events.
   * @param request The SHIORI Request
   * @returns The SHIORI Response
   */
  request(request: string | ShioriJK.Message.Request): Shiorif.Transaction<ShioriJK.Message.Response> {
    var request_obj = request instanceof ShioriJK.Message.Request ? request : new ShioriJK.Shiori.Request.Parser().parse(<string>request);
    var id = request_obj.headers["ID"] || request_obj.headers["Event"];
    this.emit("request", request_obj);
    this.emit("request:" + id, request_obj);
    return <Shiorif.Transaction<ShioriJK.Message.Response>> this.shiori.request(request_obj.toString()).then((response) => {
      var error;
      try {
        var response_obj = new ShioriJK.Shiori.Response.Parser().parse(response);
      } catch (_error) {
        error = _error;
      }
      if (!error) {
        this.emit("response", response_obj);
        this.emit("response:" + id, response_obj);
      }
      return new Shiorif.Transaction<ShioriJK.Message.Response>(this, ["request:completed", "request:" + id + ":completed"], response_obj, (resolve, reject) => !error ? resolve(response_obj) : reject(error));
    });
  }

  /**
   * SHIORI/2.x/3.x unload()
   * 
   * this emits unload(), unloaded(status), unload:completed(status) events.
   * @returns The status code
   */
  unload(): Shiorif.Transaction<number> {
    this.emit("unload");
    return <Shiorif.Transaction<number>> this.shiori.unload().then((status) => {
      this.emit("unloaded", status);
      return new Shiorif.Transaction<number>(this, ["unload:completed"], status, (resolve, reject) => status ? resolve(status) : reject(new Error("unload status is false")));
    });
  }
}

export namespace Shiorif {
  /**
   * レスポンス終了をemitするためのPromise拡張
   */
  export class Transaction<R> extends Promise<R>{
    /**
     * コンストラクタ
     * @param handler イベントをemitするハンドラ
     * @param event_names emitするイベント名
     * @param result レスポンス
     * @param callback Promiseのコンストラクタ引数
     */
    constructor(private handler: Shiorif, private event_names: string[], private result: R, callback: (resolve: (thenableOrResult: R | Promise.Thenable<R>) => void, reject: (error: any) => void) => void) {
      super(callback);
    }

    /**
     * 処理終了後にcompletedイベントをemitするthen
     */
    thenComplete<U>(onFulfill: (value: R) => U|Promise.Thenable<U>, onReject?: (error: any) => U|Promise.Thenable<U>, onProgress?: (note: any) => any): Promise<U> {
      return this.then(onFulfill, onReject, onProgress).then((value) => {
          this.event_names.forEach(event_name => this.handler.emit(event_name, this.result));
          return value;
      });
    }
  }
}
