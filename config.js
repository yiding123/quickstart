/**
 * 小程序配置文件
 */
var constants = require("./lib/admx-sdk/lib/constants");
var host = constants.ADMX_HOST;
var custom = 'custom';
var apiUrlBase = host + "/" + custom ;
var config = {
    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        // 登录地址，用于建立会话
        loginUrl: `${host}/auth/wxapp/autocreate`,
        apiUrlBase : `${apiUrlBase}`
    }
};

module.exports = config;