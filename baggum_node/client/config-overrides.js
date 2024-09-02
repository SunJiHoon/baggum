import envConfig from 'src/config/dev'; // config import

module.exports = function override(config, env) {
    // Webpack 설정 수정
    config.devServer = {
        ...config.devServer,
        client: {
            webSocketURL: {
                hostname: `${envConfig.webSocketURL}`,
                port: `${envConfig.webSocketPort}`,
                protocol: `${envConfig.webSocketProtocol}`,
            },
        },
    };
    return config;
};