//app.js

App({
  //引入sdk
  admx: require("./lib/admx-sdk/admx.js"),
  config: require("./config.js"),
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      this.admx.login({
        url: that.config.service.loginUrl,
        method:"GET",
        succ: function (res) {
          console.log("--login success");
          console.log(res);
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      });
    }
  },
  globalData:{
    userInfo:null
  }
})