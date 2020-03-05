/// <reference types="mocha" />
/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import * as assert from "power-assert";
import { Shiori } from "shioriloader";
import { Shiorif } from "../lib/shiorif";

class TestShiori implements Shiori {
    dirpath?: string;

    lastRequest?: string;

    load(dirpath: string) {
        this.dirpath = dirpath;
        return Promise.resolve(1);
    }

    unload() {
        return Promise.resolve(1);
    }

    request(req: string) {
        this.lastRequest = req;
        return Promise.resolve("SHIORI/3.0 200 OK\x0d\x0a\x0d\x0a");
    }
}

describe("ShioriTransaction", () => {
    it("can initialize", () => {
        const shiori = new TestShiori();
        const shiorif = new Shiorif(shiori);
        assert(shiorif);
    });

    it("can load", async () => {
        const shiori = new TestShiori();
        const shiorif = new Shiorif(shiori);
        assert((await shiorif.load("foo")) === 1);
        assert(shiori.dirpath === "foo");
    });

    it("can request", async () => {
        const shiori = new TestShiori();
        const shiorif = new Shiorif(shiori);
        const res = (await shiorif.request3("GET", "OnFoo")).response;
        assert(res.status_line.code === 200);
        assert(shiori.lastRequest === "GET Sentence SHIORI/2.6\x0d\x0aEvent: OnFoo\x0d\x0a\x0d\x0a");
    });

    it("can unload", async () => {
        const shiori = new TestShiori();
        const shiorif = new Shiorif(shiori);
        assert((await shiorif.unload()) === 1);
    });
});
