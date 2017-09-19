/**
 * 应用窝微信小程序版sdk
 * 该sdk将应用窝的接口与微信小程序api做了统一封装，
 * 使开发者可以非常方便的集成到自己的小程序中
 * 版本号 V2.0.1
 */

var login = require("./lib/login");
var request = require("./lib/request");
var session = require("./lib/session");
var utils=require("./lib/utils");
var file = require("./lib/file");

module.exports = {
    login: login.login,
    request: request.request,
    RequestError: request.RequestError,
    utils:utils,
    file:file,
    Session: session
};