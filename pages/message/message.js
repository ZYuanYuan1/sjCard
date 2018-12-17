// pages/message/message.js
var util = require('../../utils/util.js');
var page = 1;
var hadLastPage = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'homeList': [],//页面主列表
    'reachBottomTip': false,
    'isfirst': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    hadLastPage = false;
    that.initInfoFun();
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

  onReachBottom: function () {
    //var county = this.data.county;
    var that = this;
    this.initInfoFun();//加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: [],  'reachBottomTip': false });//将数据清空
    this.initInfoFun();
    wx.stopPullDownRefresh();
  },
  //初始化页面
  initInfoFun: function () {
    var that = this;
    if (hadLastPage != false) {
      that.setData({ reachBottomTip: true });
      return;
    };
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/message/list',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          data: { 'limit': 10, 'page': page},
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var homeList = that.data.homeList;
              var data = res.data.page.list;
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  homeList.push(data[i]);
                }
              }
              if (res.data.page.currPage == res.data.page.totalPage) {
                hadLastPage = res.data.page.currPage;
              } else {
                page++;
              };
              that.setData({ 'homeList': homeList });
            } else if (res.data.code == 500 || res.data.code == 401) {
              that.setData({ 'showPhoneModal': true });
            };

          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})