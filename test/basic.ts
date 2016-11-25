/// <reference types="mocha" />
import * as assert from "power-assert";
import {Shiori} from "shioriloader";
import {Shiorif} from "../src/lib/shiorif";

class TestShiori implements Shiori {
  load(_: string) {
    return Promise.resolve(1);
  }

  unload() {
    return Promise.resolve(1);
  }

  request(_: string) {
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
