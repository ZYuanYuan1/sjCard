// pages/invite_bonus/invite_bonus.js
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
    'inviteUserPhone':''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    hadLastPage = false;
    that.loadInvite();
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
  onHide:function(){

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  //初始化页面
  loadInvite: function () {
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
        that.setData({inviteUserPhone: userInfo.mobile});
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/user/list',
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
            };

          },

        })
      },
      fail: function (res) {
        //that.setData({ 'showPhoneModal': true });
        wx.request({
          url: getApp().apiUrl + '/api/user/list',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization':""},
          data: { 'limit': 10, 'page': page },
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
            };

          },

        })
      }
    })
  },
  onReachBottom: function () {
    this.loadInvite();//加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: [],'reachBottomTip': false });//将数据清空
    this.loadInvite();
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击邀请好友按钮分享
   */
  onShareAppMessage: function (res) {
    // console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    var inviteUserPhone = this.data.inviteUserPhone;
    console.log('000' + inviteUserPhone);
    //var shareparam = JSON.stringify({ level: inviteUserPhone, businessactivityid: businessactivityid })
    return {
      title:'赏金宝贝',
      path: "/pages/index/index?inviteUserPhone=" + inviteUserPhone,
      imageUrl: 'https://img.sahuanka.com/sjCard/images/home_banner.png'
    }
  },
  //跳转到邀请有奖说明
  skip_invite_bonus_intro:function(){
    wx.navigateTo({
      url: '/pages/invite_bonus_intro/invite_bonus_intro',
    })
  },
   //跳转到邀请商家有奖说明
  skip_invite_business_info: function () {
    wx.navigateTo({
      url: '/pages/invite_business_info/invite_business_info',
    })
  }
})