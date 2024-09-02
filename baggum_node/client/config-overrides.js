// config-overrides.js
module.exports = function override(config, env) {
    // Webpack DevServer 설정을 직접 추가
    config.devServer = {
      ...config.devServer,
      port: 3000, // 포트를 3000으로 설정
      liveReload: true,
      host: "0.0.0.0",
      allowedHosts: "all",
      open: true,
      client: {
        overlay: true,
        webSocketURL: "ws://localhost:3000/ws", // WebSocket URL을 포트 3000으로 설정
      },
      compress: true,
    };
    return config;
  };
  