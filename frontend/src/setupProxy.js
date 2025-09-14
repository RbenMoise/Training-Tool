// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Old system → 4000
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
    })
  );

  // New system → 5000
  app.use(
    "/att",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
