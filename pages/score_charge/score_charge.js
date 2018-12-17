// pages/score_charge/score_charge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cashVal:'',//充值金额
     showPhoneModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
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
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.setData({ 'showPhoneModal': false });//绑定手机号成功后影藏弹框
    }
  },
  //实时获取充值金额
  getCashVal:function(e){
    var currVal=e.detail.value.trim();
    this.setData({ cashVal:currVal});
  },
  //去充值按钮
  gotocharge:function(){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        var currCash = that.data.cashVal;
        if (!currCash) {
          wx.showToast({
            title: '充值金额不能为空',
            icon: 'none',
            duration: 2000
          })
          return
        };
        var check = /^\d+(\.{0,1}\d+){0,1}$/;//验证非负数
        if (!check.test(currCash)){
          wx.showToast({
            title: '充值金额不能小于0',
            icon: 'none',
            duration: 2000
          })
          return
        }
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype': 4, 'amount':currCash},
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res){
            console.log(res);
            if (res.data.code == 0) {
              var orderInfo = res.data.order;
              var orderId = orderInfo.orderid
              //调用支付接口
              that.wxpay(orderId,tokenVal);
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
  //调用支付接口
  wxpay: function (orderId,tokenVal){
    wx.request({
      url: getApp().apiUrl + '/api/order/creatPayOrder',
      method: 'post',
      data: { 'orderid': orderId },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          //待完成-res参数
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 2000
              });
              // wx.redirectTo({
              //   url: '/pages/myOrders/myOrders'
              // })
              wx.navigateBack({
                delta:1
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000
              });

            },
          })

        };

      },

    })
  }
 
 
})