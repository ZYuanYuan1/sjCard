// pages/deposit/deposit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    segmentTitles: ['保证金','年费'],
    segmentIndex:0,
    isAmountContainerSelected: false,
    amountContainerBgImageURL: '/images/bg_deposit_amount.png',
    business: {},//商家信息
    businessType: 1,
    isshowpay:true,
    ordertype:9  //  9保证金  10年费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var businessType
    if (options.businessType) {
      businessType = options.businessType;
      that.setData({ "businessType": businessType });
    }
    console.log(businessType);
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

  segmentSelected: function (event) {
    var that = this;
    if (that.data.segmentIndex === event.currentTarget.dataset.index) {
      console.log(1);
      return;
    }else{
      console.log(2);
    }
    var index = event.currentTarget.dataset.index
    console.log(event.currentTarget.dataset.index);
    that.setData({
      segmentIndex: event.currentTarget.dataset.index
    });
    if (index==0&&that.data.business.isbond==1){
      that.setData({ 'isshowpay': false });
      that.setData({'ordertype':9});
    } else if (index == 0 && that.data.business.isbond == 0){
      that.setData({ 'isshowpay': true });
      that.setData({ 'ordertype': 9 });
    }else{
      that.setData({ 'isshowpay': true });
      that.setData({ 'ordertype': 10 });
    }
    
    //console.log('segmentSelected----' + that.segmentIndex )
  },

  amountContainerSelected: function (event) {
    var that = this;
    if (that.data.isAmountContainerSelected) {
      that.setData({
        isAmountContainerSelected: false,
        amountContainerBgImageURL: '/images/bg_deposit_amount.png'
      });
      console.log('/images/bg_deposit_amount.png')
    } else {
      that.setData({
        isAmountContainerSelected: true,
        amountContainerBgImageURL: '/images/bg_deposit_amount_selected.png'
      });
    }
  },
  //初始化页面
  initInfoFun: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        console.log(userInfo.mobile);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/business/info',
          method: 'post',
          data: { 'phone': userInfo.mobile },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data.business);
            var business = res.data.business;
            that.setData({ 'business': business });
            if (business.isbond==1){
              that.setData({'isshowpay':false});
            }
          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //去充值按钮
  gotocharge: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        var ordertype = that.data.ordertype;
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype': ordertype},
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var orderInfo = res.data.order;
              var orderId = orderInfo.orderid
              //调用支付接口
              that.wxpay(orderId, tokenVal);
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
  wxpay: function (orderId, tokenVal) {
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
              wx.navigateTo({
                url: '/pages/accountDetail/accountDetail',
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