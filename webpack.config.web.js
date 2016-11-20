const config = require("webpack-config-narazaka-ts-js").web;

config.entry.shiorif = "./src/lib/shiorif.ts";
config.output.library = "shiorif";

module.exports = config;
