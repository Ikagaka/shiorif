'use strict';

var assert = require('power-assert');
var ShioriJK = require('shiorijk');
const shiorif = require('../src/lib/shiorif');
var Shiorif = shiorif.Shiorif;


describe('ShioriTransaction', () => {
  it('can initialize', () => {
    assert(new Shiorif());
  });
});
