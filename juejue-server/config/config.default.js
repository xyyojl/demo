/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1751699987233_1422';

  // add your middleware config here
  config.middleware = [];

  // 白名单配置
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  };

  // 单数据库信息配置
  config.mysql = {
    client: {
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '55255526',
      // 数据库名
      database: 'juejue-cost'
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  };

  config.jwt = {
    secret: 'airstar'
  };

  // egg 提供两种文件接收模式，1 是 file 直接读取，2 是 stream 流的方式
  config.multipart = {
    mode: 'file'
  };

  // 解决跨域
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credential: true, // 允许 Cookie 跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  };

  return {
    ...config,
    ...userConfig,
  };
};
