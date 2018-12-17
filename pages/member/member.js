// pages/member/member.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    userInfo: {},//用户信息
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
    //var userObj = this.data.userInfo;  
    this.initInfoFun();
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
  //初始化页面
  initInfoFun: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log('123' + res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        wx.request({
          url: getApp().apiUrl + '/api/user/info',
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var userInfo = res.data.user;
              var currGrade = userInfo.grade;
              if (currGrade == 0) {
                userInfo.headimg = 'http://img.sahuanka.com/sjCard/images/levelone.png'
              } else if (currGrade == 99) {
                userInfo.headimg = 'http://img.sahuanka.com/sjCard/images/leveltwo.png'
              } else if (currGrade == 299) {
                userInfo.headimg = 'http://img.sahuanka.com/sjCard/images/levelthree.png'
              } else if (currGrade == 499) {
                userInfo.headimg = '/images/levelfour.png'
              } else if (currGrade == 999) {
                userInfo.headimg = 'http://img.sahuanka.com/sjCard/images/levelfive.png'
              }
              that.setData({ 'userInfo': userInfo });

            } else if (res.data.code == 500 || res.data.code == 401) {
              that.setData({ 'showPhoneModal': true });
            };

          },

        })
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
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
      this.initInfoFun();
    }
  },
  //跳转至-会员升级界面
  skip_memberPromote: function () {
    wx.navigateTo({
      url: '/pages/memberPromote/memberPromote',
    })
  },
  //跳转至-信用分说明
  skip_creditScore: function () {
    wx.navigateTo({
      url: '/pages/creditScore/creditScore',
    })
  },
  //跳转至-我的账户
  skip_myAccount: function () {
    wx.navigateTo({
      url: '/pages/myAccount/myAccount',
    })
  },
  //跳转至-我的任务
  skip_myTask: function () {
    wx.navigateTo({
      url: '/pages/myTask/myTask',
    })
  },
  //跳转至-我的订单
  skip_myOrders: function () {
    wx.navigateTo({
      url: '/pages/myOrders/myOrders',
    })
  },
  skip_myMessage: function () {
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  //跳转至-我的关注
  skip_myAttention: function () {
    wx.navigateTo({
      url: '/pages/myAttention/myAttention',
    })
  },
  //跳转至-邀请有奖
  skip_invite_bonus: function () {
    wx.navigateTo({
      url: '/pages/invite_bonus/invite_bonus',
    })
  },
  //跳转至-申请成为商家
  skip_apply: function () {
    wx.navigateTo({
      url: '/pages/applyBusiness/applyBusiness',
    })
  },
  skip_freebusiness: function () {
    wx.navigateTo({
      url: '/pages/freeBusiness/freeBusiness?businessType=1',
    })
  },
  skip_paybusiness: function () {
    wx.navigateTo({
      url: '/pages/freeBusiness/freeBusiness?businessType=2',
    })
  },



  skip_myinfo: function () {
    wx.navigateTo({
      url: '/pages/myInfo/myInfo',
    })
  },

  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    //util.errImgFun(e, this);
    var _errImg = e.target.dataset.errImg;
    var userInfo = this.data.userInfo
    this.data.userInfo.avatarurl = "/images/defaultImg.png"
    this.setData({ userInfo: userInfo })
  },
  //跳转至-扫码
  skip_scanCode: function () {
    wx.scanCode({
      success: (scanCodeRes) => {
        console.log(scanCodeRes)
        wx.getStorage({
          key: 'loginStutes',
          success: function (res) {
            console.log(res);
            var userInfo = JSON.parse(res.data);
            var tokenVal = userInfo.app_token;
            //that.setData({ 'userInfo': userInfo });
            wx.request({
              url: scanCodeRes.result,
              method: 'post',
              header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
              success: function (res) {
                console.log(res);
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'error',
                    duration: 2000
                  })
                };

              },

            })
          },
          fail: function (res) {
            that.setData({ 'showPhoneModal': true });
          }
        })
      }
    })
  },
  
})