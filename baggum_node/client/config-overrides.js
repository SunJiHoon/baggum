// config-overrides.js
module.exports = function override(config, env) {
    if (env === 'development') {
      config.devServer = {
        ...config.devServer,
        client: {
          ...config.devServer.client,
          webSocketURL: 'wss://baggumi.com/ws',
        },
      };
    }
    return config;
  };