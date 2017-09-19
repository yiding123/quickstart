var constants = require("./constants.js");
var utils = require("./utils.js");
var Session = require("./session.js");
var Request = require("./request.js");
/**
 * 微信登录，获取 code 和 encryptData
 * callback(error, res)
 */
function getLoginCode(callback) {
  console.log('getLoginCode')
  wx.login({
    success: function (loginResult) {
      console.log('login success')
      wx.getUserInfo({
        success: function (userResult) {
          callback(null, {
            code: loginResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            userInfo: userResult.userInfo,
          });
        },

        fail: function (userError) {
          var error = {
            code: constants.ERR_WX_GET_USER_INFO,
            message: '获取微信用户信息失败，请检查网络状态',
            detail: userError
          };
          callback(error, null);
        },
      });
    },

    fail: function (loginError) {
      var error = {
        code: constants.ERR_WX_LOGIN_FAILED,
        message: '微信登录失败，请检查网络状态',
        detail: loginError
      };
      callback(error, null);
    },
  });
};

/**
 * 基本登录,使用账号密码方式登录
 * 进行服务器登录，以获得登录会话
 * @param {string} options.account 登录账号
 * @param {string} options.passwrod 登录密码
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 * @param {Object} options.header 请求头信息
 */
function loginWithAcct(options) {
  console.log(options);
  if (!options){
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "options参数缺失");
  }
  if (!options.data.account){
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.account缺失");
  }
  if (!options.data.password){
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数data.password缺失");
  }
  getLoginCode(function (wxLoginError, wxLoginResult) {
    var code = wxLoginResult.code;
    var header = {};
    header[constants.WX_HEADER_CODE] = code;
    Request.request(utils.extend({}, options, {
      url: constants.SERVICE.loginBasic ,
      header: header,
      succ: function (data) {
        if (data.session_token) {
          Session.set(data);
          options.succ(data);
        } else {
          var errorMessage = '登录失败(' + data.code + ')：' + (data.error || '未知错误');
          throw new Request.RequestError(constants.ERR_WX_GET_USER_INFO, errorMessage);
        }
      }
    }));
  });
}

/**
 * 以微信授权方式登录
 * 如果账号不存在不会返回user,只返回userInfo
 * userInfo是微信用户信息
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
function loginWithWX(options) {
  console.log('api login called')
  getLoginCode(function (wxLoginError, wxLoginResult) {
    console.log(wxLoginResult)
    if (wxLoginError) {
      throw new Request.RequestError(constants.ERR_WX_GET_USER_INFO, wxLoginError);
      return;
    }

    var userInfo = wxLoginResult.userInfo;

    // 构造请求头，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var encryptedData = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var header = {};
    console.log("code=" + code);
    console.log("encryptData=" + encryptedData);
    console.log("iv=" + iv);

    header[constants.WX_HEADER_CODE] = code;
    header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
    header[constants.WX_HEADER_IV] = iv;

    Request.request(utils.extend({}, options,{
      header: header,
      method:"GET",
      url: constants.SERVICE.login,
      succ: function (data) {
        if (data.session_token) {
          data.userInfo = userInfo;
          Session.set(data);
          options.succ(data);
        } else {
          var errorMessage = '登录失败(' + data.code + ')：' + (data.error || '未知错误');
          var noSessionError = {
            code: constants.ERR_LOGIN_SESSION_NOT_RECEIVED,
            message: errorMessage
          };
          options.fail(noSessionError);
        }
      }
    }));

  });

}

/**
 * 以微信授权方式登录
 * 如果账号不存在自动创建账号
 * 进行服务器登录，以获得登录会话
 * @param {Object} options 登录配置
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
function loginAutoCreateAcct(options) {
  console.log('api login called')
  login(utils.extend({}, {
    url: constants.SERVICE.loginAutoCreateAcct
  }, options));
}


/**
 * 解除与微信的绑定
 * 解除成功后将清除会话信息,必需要重新登录
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 * @param {Object} options.header 请求头信息
 */
function unbindWX(options) {
  console.log(options);
  Request.request(utils.extend({}, options, {
    url: constants.SERVICE.unbindwx,
    succ: function (data) {
      Session.clear();
    }
  }));
}

module.exports.login = {
  loginWithWX: loginWithWX,
  loginWithAcct: loginWithAcct,
  unbindWX:unbindWX,
  loginAutoCreateAcct: loginAutoCreateAcct
}





