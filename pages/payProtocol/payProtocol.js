// pages/payProtocol/payProtocol.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'chkvalue': '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  skip_apply: function () {
    var chk = this.data.chkvalue;
    console.log(this.data.chkvalue);
    if (chk == '1') {
      wx.navigateTo({
        url: '/pages/apply/apply?businessType=2',
      })
    } else {
      wx.showToast({
        title: '请先阅读并同意此协议',
        icon: 'none'
      });
      return false
    }

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({ chkvalue: e.detail.value });
  }
})