module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  output: {
    libraryTarget: "commonjs2"
  },
  resolve: {
    modules: ["app", "node_modules"],
    extensions: [".js", ".jsx", ".react.js"],
    mainFields: ["browser", "jsnext:main", "main"]
  },
  node: {
    fs: "empty",
    net: "empty",
    child_process: "empty",
    dns: "empty",
    tls: "empty"
  },
  target: "web"
};
