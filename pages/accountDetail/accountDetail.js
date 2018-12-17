// pages/accountDetail/accountDetail.js
var util = require('../../utils/util.js');
var page = 1;
var hadLastPage = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    'homeList': [],//页面主列表
    'reachBottomTip': false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    hadLastPage = false;
    this.initAccountInfo();
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
   // var searchVal = that.data.searchVal;
    this.initAccountInfo();//加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: [],'reachBottomTip': false});//将数据清空
    this.initAccountInfo();
    wx.stopPullDownRefresh();
  },
  initAccountInfo: function () {
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
          url: getApp().apiUrl + '/api/fundsflow/list',
          method: 'post',
          header: {'content-type':'application/x-www-form-urlencoded','Authorization': tokenVal},
          data: { 'limit':10, 'page': page, 'fundstype':2},
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var homeList = that.data.homeList;
              var data = res.data.page.list;
              //var list = res.data.responseData;
              // var totalnum = res.data.page.totalCount % res.data.page.pageSize == 0 ? res.data.page.totalCount / res.data.page.pageSize : Math.ceil(res.data.page.totalCount / res.data.page.pageSize);//总页数
              // console.log(totalnum);
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  if (data[i].fundsflowtype==1){
                    data[i].amount = '+' + data[i].amount
                  } else if (data[i].fundsflowtype ==2){
                    data[i].amount = '-' + data[i].amount
                  }
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
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.initAccountInfo();
    }
  },
})