// pages/lessonList/lessonList.js
var page = 1;
var hadLastPage = false;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'searchVal': '',//绑定搜索框的值
    'homeList': [],//页面主列表
    'bussinessId':'',
    'reachBottomTip': false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    hadLastPage = false;
    console.log(options);
    var that = this;
    var bussinessId = options.businessId;
    that.setData({ 'bussinessId': bussinessId});
    that.loadScoreListFun('', bussinessId);
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
  //加载赚积分课程
  loadScoreListFun: function (searchVal,businessid) {
    var that = this;
    if (hadLastPage != false) {
      that.setData({ reachBottomTip: true });
      return;
    };
    wx.request({
      url: getApp().apiUrl + '/api/businessactivity/list',
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { 'limit':10, 'page': page,'status': 4, 'activityname': searchVal, 'businessid': businessid},
      success: function (res){
        console.log(res);
        if (res.data.code == 0) {
          var homeList = that.data.homeList;
          var data = res.data.page.list;
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].tags) {
                var tagarr = data[i].tags.split(',');
                data[i].tags = tagarr;
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
  //input点击键盘的完成输入
  valDone: function (e) {
    console.log(e);
    var bussinessId = this.data.bussinessId;
    var currrVal = e.detail.value.trim();
    page = 1;
    hadLastPage = false;
    this.setData({'searchVal':currrVal,homeList: [], reachBottomTip:false});//将数据清空
    this.loadScoreListFun(currrVal,bussinessId);
  },
  //跳转到课程详情页
  skip_courseDetail: function (e) {
    console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId
    var currActivityType = e.currentTarget.dataset.activityType;
    var businessid= e.currentTarget.dataset.bid;
    if (currActivityType==1){
      wx.navigateTo({
        url: '/pages/scoreDetail/scoreDetail?businessactivityid=' + businessactivityid + '&businessid' + businessid,
      })
    } else if (currActivityType==2){
      wx.navigateTo({
        url: '/pages/playDetail/playDetail?businessactivityid=' + businessactivityid + '&businessid' + businessid,
      })
    } else if (currActivityType == 3){
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?businessactivityid=' + businessactivityid + '&businessid' + businessid,
      })
    }
    
  },
  onReachBottom: function () {
    //var county = this.data.county;
    var that = this;
    var bussinessId = that.data.bussinessId;
    var searchVal = that.data.searchVal;
    this.loadScoreListFun(searchVal,bussinessId);//加载列表
  },
  onPullDownRefresh: function () {
    var bussinessId = this.data.bussinessId;
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: [], searchVal: '', reachBottomTip:false});//将数据清空
    this.loadScoreListFun('',bussinessId);
    wx.stopPullDownRefresh();
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    util.errImgFun(e, this);
  }
})