// pages/freeBuesiness/freeBuesiness.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    business:{},//商家信息
    businessType:1
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
          data: { 'phone': userInfo.mobile},
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: function (res) {
            console.log(res.data.business);
            var business = res.data.business;
            that.setData({ 'business': business});
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
  
  },

  toggleDeposit:function () {
    wx.navigateTo({
      url: '../deposit/deposit',
    })
  },
  toggleAccountDetail: function () {
    wx.navigateTo({
      url: '/pages/accountDetail/accountDetail',
    })
  },
})