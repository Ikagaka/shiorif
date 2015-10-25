shiorif
===================

The convenient SHIORI Shared Library Interface

```typescript
/**
 * The convenient SHIORI Shared Library Interface
 */
export declare class Shiorif extends EventEmitter2 {
    private shiori;
    /**
     * @param shiori The instance of SHIORI Shared Library Interface
     */
    constructor(shiori: Shiori);
    /**
     * SHIORI/2.x/3.x load()
     *
     * this emits load(dirpath), loaded(status), load:completed(status) events.
     * @param dirpath The directory that SHIORI Shared Library is placed. The end character of dirpath must be the path separator (/ or \\).
     * @returns The status code
     */
    load(dirpath: string): Shiorif.Transaction<number>;
    /**
     * SHIORI/2.x/3.x request()
     *
     * this emits request(request), response(response), request:completed(response), request:{ID}(request), response:{ID}(response), request:{ID}:completed(response) events.
     * @param request The SHIORI Request
     * @returns The SHIORI Response
     */
    request(request: string | ShioriJK.Message.Request): Shiorif.Transaction<ShioriJK.Message.Response>;
    /**
     * SHIORI/2.x/3.x unload()
     *
     * this emits unload(), unloaded(status), unload:completed(status) events.
     * @returns The status code
     */
    unload(): Shiorif.Transaction<number>;
}
export declare namespace Shiorif {
    /**
     * レスポンス終了をemitするためのPromise拡張
     */
    class Transaction<R> extends Promise<R> {
        private handler;
        private event_names;
        private result;
        /**
         * コンストラクタ
         * @param handler イベントをemitするハンドラ
         * @param event_names emitするイベント名
         * @param result レスポンス
         * @param callback Promiseのコンストラクタ引数
         */
        constructor(handler: Shiorif, event_names: string[], result: R, callback: (resolve: (thenableOrResult: R | Promise.Thenable<R>) => void, reject: (error: any) => void) => void);
        /**
         * 処理終了後にcompletedイベントをemitするthen
         */
        thenComplete<U>(onFulfill: (value: R) => U | Promise.Thenable<U>, onReject?: (error: any) => U | Promise.Thenable<U>, onProgress?: (note: any) => any): Promise<U>;
    }
}
```