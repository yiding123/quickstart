//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    resBody: "",
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  test:function(e){
    var that = this;
    var url = e.detail.value.url;
    var reqBody = e.detail.value.req;
    if (url.length == 0) {
      wx.showModal({
        content:"请输入相对url",
        showCancel:false
      });
      return
    }
    var reqUrl = app.config.service.apiUrlBase + url;
    console.log("完整url:" + reqUrl);
    app.admx.request({
      url: reqUrl ,
      data: reqBody,
      succ: function (res) {
        that.setData({
          resBody: JSON.stringify(res)
        })
      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
      }
    })
  }
})
