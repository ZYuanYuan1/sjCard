// pages/myAccount/myAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    userInfo:{}//用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.initAccountInfo();
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
  initAccountInfo:function(){
    var that=this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res){
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //用户信息
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          data: {},
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var info=res.data.user;
            that.setData({ 'userInfo':info});
          }

        })  
        //that.setData({ 'userInfo': userInfo });
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
  //跳转到充值积分界面
  skip_score_charge:function(){
    wx.navigateTo({
      url: '/pages/score_charge/score_charge',
    })
  },
  //跳转到转换积分界面
  skip_conversion: function () {
    wx.navigateTo({
      url: '/pages/conversion/conversion',
    })
  },
  //跳转到提现界面
  skip_cash_charge:function(){
    wx.navigateTo({
      url: '/pages/cash_charge/cash_charge',
    })
  },
  //跳转到交易明细
  skip_dealDetail:function(){
    wx.navigateTo({
      url: '/pages/dealDetail/dealDetail',
    })
  },
  //跳转到账户明细
  skip_accountDetail:function(){
    wx.navigateTo({
      url: '/pages/accountDetail/accountDetail',
    })
  },
  //跳转到提现记录
  skip_cash_record:function(){
    wx.navigateTo({
      url: '/pages/cash_record/cash_record',
    })
  }
})