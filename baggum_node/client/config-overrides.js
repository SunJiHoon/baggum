// config-overrides.js
const { override, addWebpackDevServerConfig } = require('customize-cra');

module.exports = override(
  addWebpackDevServerConfig({
    devServer: {
      port: 3000,
      liveReload: true,
      host: "0.0.0.0",
      allowedHosts: "all",
      open: true,
      client: {
        overlay: true,
        webSocketURL: "ws://0.0.0.0:5000/ws",
      },
      compress: true,
    },
  })
);
