//app.js
//var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
// var config = require('utils/config.js');
// var qqmapsdk;
App({
  onLaunch: function (options) {
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: config.key
    // });
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    //console.log(logs);
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // console.log(options);
    this.globalData.scene = options.scene;
    this.getUserInfo(function(info){
      // console.log(info);
    });
    // this.locationFun();
    
  },
  onshow:function(options){
    console.log(options);
    // this.globalData.scene = options.scene;
  },
  //判断用户是否绑定过手机号
  getUserInfo: function (cb) {
    var that = this
      //调用登录接口
      wx.login({
        success: function (res) {
          // console.log(res);
          var js_code=res.code;
          wx.request({
            url: that.apiUrl + '/api/weixin/login',
            method: 'post',
            data:{ 'appletCode': js_code},
            header: { 'content-type': 'application/x-www-form-urlencoded'},
            success: function (res) {
              // console.log(res);
              if(res.data.code==0){
                //如果用户不为空
                if(res.data.user){
                  wx.setStorage({
                    key: 'loginStutes',
                    data: JSON.stringify(res.data.user)
                  })
                  that.globalData.userInfo = res.data.user
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
              }
            },

          })
        },
        fail:function(){
           
        }
      })
  },
  //获取设备高度
  getSystemInfo: function (cb) {
    var that = this
    if (that.globalData.systemInfo) {
      typeof cb == "function" && cb(that.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },
  //定位地址方法
  locationFun() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            //that.setData({ 'locationStr': res.result.address })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(11);
          }
        });

      }
    })
  },
  //判断用户是否登录
  globalData: {
    userInfo: null,
    county:'温州市',
    scene: null,
    systemInfo: null,
    loginInfo:null,
    invitePeopleNumber:"",
    latitude:'',
    longitude:'',
    localAddress:'杭州'
  },

  // apiUrl: "http://127.0.0.1:8080"
  // apiUrl: "http://116.62.61.1/"z
  //apiUrl: "https://cs1.wdtzt.com"
  // apiUrl: "https://admin.wdtzt.com"
  //apiUrl: "http://192.168.50.111:8080"
    // apiUrl:"http://192.168.0.199:8081"
  // apiUrl:"http://192.168.0.199:8081"
  //  apiUrl: "https://api.jcrsjy.com"
  apiUrl: "https://api.sahuanka.com" //正式
  // apiUrl: "https://test.jcrsjy.com" //测试
})