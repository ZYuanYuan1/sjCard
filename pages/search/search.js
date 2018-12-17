// pages/search/search.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var config = require('../../utils/config.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchAddress:null,
    location:"重新定位",
    address:'',
    searchRecords:["西湖"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.key
    });
    var that = this;
    var address
    if (options.loca) {
      address = options.loca;
    }
    that.setData({'address':address});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  locationViewSelected: function () {
    
    
    var that = this;
    that.setData({ 'address': '定位中...','location':'正在定位...'});
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //that.globalData.latitude = latitude;
        //that.globalData.longitude = longitude;
        // 调用接口
        console.log(latitude + '||' + longitude);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            var address = res.result.address
            if (res.result.address_reference && res.result.address_reference.landmark_l1) {
              address = res.result.address_reference.landmark_l1.title;
            } else if (res.result.address_reference && res.result.address_reference.landmark_l2) {
              address = res.result.address_reference.landmark_l2.title;
            } else {
              // that.setData({ 'locationStr': address })
            }

            that.setData({ 'address': address , 'location': '重新定位' })
            //跳回首页
            wx.reLaunch({
              url: '/pages/index/index?location=' + address
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(11);
           
          }
        });

      },
      fail: function (res) {
        console.log(res);
        that.setData({ 'address': '定位失败', 'location': '重新定位' })
      },
      complete: function (res) {
        console.log(11);

      }
    })
  },
  keyboardDoneSelected: function (event) {
    var searchAddress = event.detail.value.trim();
    this.setData({
       searchAddress: searchAddress
    });
    console.log(this.data.searchAddress);
  },
  searchRecordSelected: function (event) {
    var address = event.currentTarget.dataset.address
    console.log(address);
  }
  
})