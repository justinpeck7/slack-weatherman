const dotenv = require("dotenv");
dotenv.config();

/* eslint-disable no-undef */
require = require("esm")(module);
module.exports = require("./src/index.js");
