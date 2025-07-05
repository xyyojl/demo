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

  // 配置 ejs
  // 将 view 文件夹下的 .html 后缀的文件，识别为 .ejs
  config.view = {
    mapping: {'.html': 'ejs'} // 左边写成 .html 后缀，会自动渲染 .html 文件
  }

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
      database: 'test'
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
