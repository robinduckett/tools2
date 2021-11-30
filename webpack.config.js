const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  devtool: "eval",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "clb-tools.js",
    library: {
      name: "clbTools",
      type: "umd",
    },
  },
};
