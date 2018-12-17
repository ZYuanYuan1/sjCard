// pages/myAttention/myAttention.js
var util = require('../../utils/util.js');
var page = 1;
var hadLastPage = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,//取消关注弹框
    showPhoneModal:false,//手机号绑定弹框
    saveList: [],//列表
    reachBottomTip: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    hadLastPage = false;
    this.initMySaveListFun();
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
  //初始化我的收藏列表
  initMySaveListFun:function(){
      var that=this;
      if (hadLastPage != false) {
        that.setData({ reachBottomTip: true });
        return;
      };
      wx.getStorage({
        key:'loginStutes',
        success:function(res){
          console.log(res);
          var userInfo=JSON.parse(res.data);
          var tokenVal = userInfo.app_token;
          that.setData({ 'userInfo': userInfo});
          wx.request({
            url: getApp().apiUrl+'/api/attention/list',
            method: 'post',
            data: { 'limit':10, 'page': page},
            header: {'content-type': 'application/x-www-form-urlencoded', 'Authorization':tokenVal},
            success: function (res){
              console.log(res);
              if (res.data.code == 0) {
                var saveList = that.data.saveList;
                var data = res.data.page.list;
                if (data && data.length > 0) {
                  for (var i = 0; i < data.length; i++) {
                    saveList.push(data[i]);
                  }
                }
                if (res.data.page.currPage == res.data.page.totalPage) {
                  hadLastPage = res.data.page.currPage;
                } else {
                  page++;
                };
                that.setData({'saveList':saveList});
              };

            },

          })
        },
        fail:function(res){
          that.setData({'showPhoneModal':true});
        }
      })
  },
  onReachBottom: function () {
    console.log('1');
    this.initMySaveListFun();//加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({ saveList: [],'reachBottomTip': false});//将数据清空
    this.initMySaveListFun();
    wx.stopPullDownRefresh();
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo:function(e){
    console.log(e);
    var bindInfo=e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo){
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.initMySaveListFun();
    }
  },
  preventTouchMove: function (){
  },
  //展现收藏弹框
  showDialogBtn: function (e){
    console.log(e);
    var currSaveId=e.currentTarget.dataset.saveId;//当前收藏id
    var currIndex = e.currentTarget.dataset.index;//当前索引
    this.setData({
      showModal: true, currSaveId: currSaveId, currIndex: currIndex
    })
    
  },
  //取消关注-取消按钮
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  //跳转到商家课程列表
  skip_lessonList:function (e) {
    console.log(e);
    var businessId = e.currentTarget.dataset.businessId;
    wx.navigateTo({
      url: '/pages/lessonList/lessonList?businessId=' + businessId,
    })
  },
  //取消关注-确定按钮
  onConfirm: function () {
    var that=this;
    var currSaveId = this.data.currSaveId;//当前收藏id
    var currIndex = this.data.currIndex;//当前索引
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/attention/delete',
          method: 'post',
          data: { 'businessid': currSaveId},
          header: { 'content-type': 'text/html;charset=UTF-8','Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
               wx.showToast({
                 title: '取消成功',
                 icon:'success'
               }) 
               var saveList = that.data.saveList;
               saveList.splice(currIndex,1);
               that.setData({ saveList: saveList});
                that.setData({
                  showModal: false
                });
            };

          },

        })
      },
      fail: function (res) {
        //that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    util.errImgFun(e, this);
  }
})