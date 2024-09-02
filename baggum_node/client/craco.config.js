// craco.config.js
module.exports = {
    devServer: (devServerConfig) => {
      // 기존 devServer 설정을 그대로 유지하면서 필요한 설정만 추가합니다.
      return {
        ...devServerConfig,
        client: {
          ...devServerConfig.client,
          webSocketURL: 'wss://socket.baggumi.com/ws',
        },
      };
    },
  };