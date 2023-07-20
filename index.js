"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/@ellucian/react-router.min.js");
} else {
  module.exports = require("./cjs/@ellucian/react-router.js");
}
