/// <reference types="mocha" />
// tslint:disable no-implicit-dependencies
import * as assert from "power-assert";
import { Shiori } from "shioriloader";
import { Shiorif } from "../lib/shiorif";

class TestShiori implements Shiori {
  load(_: string) { // tslint:disable-line prefer-function-over-method
    return Promise.resolve(1);
  }

  unload() { // tslint:disable-line prefer-function-over-method
    return Promise.resolve(1);
  }

  request(_: string) { // tslint:disable-line prefer-function-over-method
    return Promise.resolve("");
  }
}

describe("ShioriTransaction", () => {
  it("can initialize", () => {
    const shiori = new TestShiori();
    const shiorif = new Shiorif(shiori);
    assert(shiorif);
  });
});
