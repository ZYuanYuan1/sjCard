// pages/playGame/playGame.js
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
    'reachBottomTip': false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    hadLastPage = false;
    this.setData({'homeList': []});
    that.loadScoreListFun('');
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
    //var homeList = this.data.homeList;
    //his.setData({ searchVal: '', 'homeList': [], reachBottomTip: false });
    //page = 1;
    //hadLastPage = false;
    //this.loadScoreListFun('');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  //加载赚积分课程
  loadScoreListFun: function (searchVal) {
    var that = this;
    if (hadLastPage != false) {
      that.setData({ reachBottomTip: true });
      return;
    };
    wx.request({
      url: getApp().apiUrl + '/api/businessactivity/sahuanlist',
      method: 'post',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { 'limit': 10, 'page': page,  'status': 4, 'activityname': searchVal },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var homeList = that.data.homeList;
          var data = res.data.page.list;
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].tags){
                var tagarr=data[i].tags.split(',');
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
  //input点击键盘的完成完成输入
  valDone: function (e) {
    console.log(e);
    var currrVal = e.detail.value.trim();
    this.setData({ 'searchVal': currrVal});
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: []});//将数据清空
    this.loadScoreListFun(currrVal);
  },
  //跳转至-活动详情
  skip_playDetail: function (e) {
    console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId
    var currActivityType = e.currentTarget.dataset.activityType;
    console.log(currActivityType);
    if (currActivityType == 1) {
      wx.navigateTo({
        url: '/pages/scoreDetail/scoreDetail?businessactivityid=' + businessactivityid,
      })
    } else if (currActivityType == 2) {
      wx.navigateTo({
        url: '/pages/playDetail/playDetail?businessactivityid=' + businessactivityid,
      })
    } else if (currActivityType == 3) {
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?businessactivityid=' + businessactivityid,
      })
    }
  },
  onReachBottom: function () {
    //var county = this.data.county;
    var that = this;
    var searchVal = that.data.searchVal;
    this.loadScoreListFun(searchVal);//加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({ homeList: [],searchVal:'','reachBottomTip': false});//将数据清空
    this.loadScoreListFun('');
    wx.stopPullDownRefresh();
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    //util.errImgFun(e, this);
    //play_default_img.png
    var _errImg = e.target.dataset.errImg;
    var _errObj = {};
    _errObj[_errImg] = "/images/home_default_img.png";
    console.log(e.detail.errMsg + "----" + "----" + _errImg);
    this.setData(_errObj);
  }
})