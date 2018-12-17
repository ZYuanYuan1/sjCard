// pages/creditScore/creditScore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,//去支付弹框
    showPhoneModal: false,//手机号绑定弹框
    currcredit:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //加载信用分详情
    this.initCreditScoreFun();
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
    this.initCreditScoreFun();
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
  //初始化信用分详情
  initCreditScoreFun:function(){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        //console.log(res);
        var userInfo = JSON.parse(res.data);
        console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //用户信息
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          data: {},
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var info = res.data.user;
            var currcredit = info.credit;
            that.setData({ currcredit: currcredit });
          }

        })     
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确定购买-创建订单
  sureBuyCredit:function(){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype':3},
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              // var activityInfo = that.data.activityInfo;
              var orderInfo = res.data.order;
              orderInfo = JSON.stringify(res.data.order);
              //待完成-需拼接一个-创建订单成功后的对象
              wx.navigateTo({
                url: '/pages/sureOrders/sureOrders?creditOrderInfo=' + orderInfo
              })//领取成功跳转到-确认订单页面
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
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
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.setData({ 'showPhoneModal': false });//绑定手机号成功后影藏弹框
      this.initCreditScoreFun();
    }
  },
  preventTouchMove: function () {
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  //弹框关闭按钮
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  //当信用分为5的时候-点击确认购买按钮
  buytip: function () {
    wx.showToast({
      title: '您的信用分已达5分',
      icon: 'none',
      duration: 2000
    })
  }
})