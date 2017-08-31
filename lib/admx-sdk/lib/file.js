var constants = require("./constants.js");
var utils = require("./utils.js");
var Session = require("./session.js");
var Request = require("./request.js");


/**
 * 基本登录,使用账号密码方式登录
 * 进行服务器登录，以获得登录会话
 * @param {string} options.filePath 要上传文件资源的路径
 * @param {Object} options.formData HTTP 请求中其他额外的 form data
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 * @param {Object} options.header 请求头信息
 */
function upload(options) {
  console.log(options);
  if (!options) {
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "options参数缺失");
  }
  if (!options.filePath) {
    throw new Request.RequestError(constants.ERR_INVALID_PARAMS, "参数filePath缺失");
  }
  var header = {};
  header[constants.HEADER_APPKEY] = constants.APPKEY;
  console.log(constants.SERVICE.uploadFile)
  wx.uploadFile({
    url: constants.SERVICE.uploadFile,
    filePath: options.filePath,
    name: 'file',
    header:header,
    formData: options.formData,
    success: function (res) {
      console.log("----success");
      console.log(res);
      if (res.data){
        var data = JSON.parse(res.data);
        if(data.code == 0){
          options.succ(data.body);
        }else{
          options.fail(data);
        }
      }
    },
    fail: function (e) {
      console.log("----------------fail");
      console.log(e);
      options.fail(e);
    }
  })
}

module.exports.upload = upload;