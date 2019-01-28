// pages/myTask/myTask.js
var util = require('../../utils/util.js');
var QR = require("../../utils/qrcode.js");
var page = 1;
var hadLastPage = false;
var sliderWidth = 55; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["全部", "待参与", "已过期","待评价"],
    showPhoneModal: false,//手机号绑定弹框
    showModal: false,//电子券弹框
    showCancelModal: false,//取消任务
    taskList:[],//任务列表
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    placeholder: '',//默认二维码生成文本
  },
  onLoad: function () {
    var that = this;
    page = 1;
    hadLastPage = false;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.initMyTaskListFun();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    var pages = getCurrentPages();

    var currPage = pages[pages.length - 1]; //当前页面

    console.log(currPage.__data__.state)
    this.setData({
      state: currPage.__data__.state
    })
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
    //console.log(123);
    //wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    console.log(333);
    this.initMyTaskListFun();//加载列表
  },
  //初始化页面列表
  initMyTaskListFun:function(){
    var that = this;
    if (hadLastPage != false) {
      //that.setData({ reachBottomTip: true });
      return;
    };
    wx.getStorage({
      key:'loginStutes',
      success: function (res){
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/order/list',
          method: 'post',
          data: {'ordertype':1,'limit':10,'page':page},
          header: { 'content-type':'application/x-www-form-urlencoded','Authorization': tokenVal },
          success: function (res){
            console.log(res);
            // that.setData({ 'taskList': [] });
            if (res.data.code == 0) {
              var taskList = that.data.taskList;
              var data = res.data.page.list;
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  taskList.push(data[i]);
                }
              }
              if (res.data.page.currPage == res.data.page.totalPage) {
                hadLastPage = res.data.page.currPage;
              } else {
                page++;
              };
              that.setData({'taskList':taskList});
            };

          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
    console.log(that.data.taskList)
  },
  //跳转到积分详情
  skip_coreDetail: function (e) {
    console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId
    wx.navigateTo({
      url: '/pages/scoreDetail/scoreDetail?businessactivityid=' + businessactivityid,
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      page = 1;
      hadLastPage = false;
      this.initMyTaskListFun();
    }
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    util.errImgFun(e, this);
  },
  preventTouchMove: function () {
  },
  showDialogBtn: function (e) {
    var orderNo = e.target.dataset.orderNumber;
    this.setData({
      orderNo:orderNo,
      showModal: true
    })
    console.log(e);
    //生成二维码
    var size = this.setCanvasSize();//动态设置画布大小
    var qrcData =e.target.dataset.qrcodeUrl;
    if (qrcData){
      this.createQrCode(qrcData, "mycanvas", size.w, size.h);
    }
  },
  showDialogCancelTask: function (e) {
    var orderNo = e.target.dataset.orderNumber;
    this.setData({
      orderNo: orderNo,
      showCancelModal: true
    })
  },
  //关闭按钮
  onCancelCard:function () {
    this.setData({
      showModal: false
    });
  },
  //关闭按钮
  onCancelTask: function () {
    this.setData({
      showCancelModal: false
    });
  },
  //去取消按钮
  onConfirm: function (e) {
    var that = this;
    var orderNo = e.target.dataset.orderNo;
    console.log(orderNo);
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/order/canceltesk',
          method: 'post',
          data: { 'orderNo': orderNo },
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({
                showCancelModal: false
              })
              hadLastPage = false;
              that.setData({
                taskList: []
              })
              that.initMyTaskListFun();//加载列表
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              that.setData({
                showCancelModal: false
              })
            };
          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      // var res = wx.getSystemInfoSync();
      // var scale = 375/ 343;//不同屏幕下canvas的适配比例；设计稿是750宽
      // var width = res.windowWidth / scale;
      // var height = width;//canvas画布为正方形
      size.w = 100;
      size.h = 100;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  pop_evaluate: function (e) {
    var that = this;
    var businessActivityId = e.target.dataset.businessActivityId;
    var orderId = e.target.dataset.orderId;
    var ordertype = e.target.dataset.ordertype
    wx.navigateTo({
      url: '/pages/comment/comment?businessActivityId=' + JSON.stringify(businessActivityId) + '&orderId=' + JSON.stringify(orderId),
    })

  },
  
})