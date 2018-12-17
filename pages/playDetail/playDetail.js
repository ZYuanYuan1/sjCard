// pages/playDetail/playDetail.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    businessactivityid: '',//课程详情
    businessInfo: {},//商家信息
    activityInfo: {},//活动信息
    saving: 0,//0是未收藏，1是收藏
    inviteUserPhone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // var playDetailId = options.businessactivityid;
    // if (options.inviteUserPhone) {
    //   var inviteUserPhone = options.inviteUserPhone;
    //   getApp().globalData.invitePeopleNumber = inviteUserPhone;
    // }
    var playDetailId
    if (options.businessactivityid) {
      playDetailId = options.businessactivityid;
      //console.log('222');
    }
    //来自分享的参数
    if (options.shareparam) {
      console.log('888');
      var info = JSON.parse(options.shareparam);
      playDetailId = info.businessactivityid;
      var inviteUserPhone = info.level;
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
      console.log(getApp().globalData.invitePeopleNumber);
    }
    this.setData({ 'businessactivityid': playDetailId });
    this.initPageDetail(playDetailId);
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
  //跳转到商家课程列表
  skip_lessonList: function () {
    var bussinessId = this.data.businessInfo.businessid
    wx.navigateTo({
      url: '/pages/lessonList/lessonList?businessId=' + bussinessId,
    })
  },
  //添加收藏和取消收藏
  save: function (e) {
    console.log(e);
    var that = this;
    var storeId = that.data.businessInfo.businessid;
    console.log(storeId);
    var curr_state = that.data.saving;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var datainfo = JSON.parse(res.data);
        var tokenval = datainfo.app_token;
        console.log(tokenval);
        if (curr_state == 1) {
          wx.request({
            url: getApp().apiUrl + '/api/attention/delete',
            method: 'POST',
            data: { 'businessid': storeId },
            header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenval },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                that.setData({
                  saving: 0
                });
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }

          })
        } else {
          wx.request({
            url: getApp().apiUrl + '/api/attention/save',
            method: 'POST',
            data: { 'businessid': storeId },
            header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenval },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                that.setData({
                  saving: 1
                });
                wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }

          });
        }
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    });
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var head = this.data.activityInfo.activityname;
    var businessactivityid = this.data.businessactivityid;
    var imgUrl = this.data.businessInfo.businesspic;
    if (imgUrl) {
      imgUrl = this.data.businessInfo.businesspic
    } else {
      imgUrl = '/images/home_banner.png'
    }
    //var userInfo = getApp().globalData.userInfo
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var inviteUserPhone = this.data.inviteUserPhone;
    console.log('000' + inviteUserPhone);
    var shareparam = JSON.stringify({ level: inviteUserPhone, businessactivityid: businessactivityid })
    return {
      title: head,
      path: "/pages/playDetail/playDetail?shareparam=" + shareparam,
      imageUrl: imgUrl
    }
  },
  initPageDetail: function (playId) {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        that.setData({ inviteUserPhone: userInfo.mobile });
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/businessactivity/info/' + playId,
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var hostInfo = res.data.business;//商家信息
              var activityInfo = res.data.businessactivity;//商家活动
              var saving = res.data.isAttention;
              console.log(activityInfo);
              that.setData({ 'businessInfo': hostInfo, 'activityInfo': activityInfo, 'saving': saving });
              //富文本
              var article = activityInfo.content;
              WxParse.wxParse('article', 'html', article, that, 15);

            };

          },

        })
      },
      fail: function () {
        wx.request({
          url: getApp().apiUrl + '/api/businessactivity/info/' + playId,
          method: 'post',
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': "" },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var hostInfo = res.data.business;//商家信息
              var activityInfo = res.data.businessactivity;//商家活动
              var saving = res.data.isAttention;
              console.log(activityInfo);
              that.setData({ 'businessInfo': hostInfo, 'activityInfo': activityInfo, 'saving': saving });
              //富文本
              var article = activityInfo.content;
              //article.replace(/\<img/gi, '<img style="max-width:100%;height:auto;width:100px;"')
              WxParse.wxParse('article', 'html', article, that, 15);

            };

          },

        })
      }
    })  
  },
  //跳转至确认订单页面
  skip_sureOrders:function(){
    //创建支付订单
    var that = this;
    var businessactivityid = that.data.businessactivityid;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res){
        //console.log(res);
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype':7, 'businessactivityid': businessactivityid },
          header: { 'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res){
            console.log(res);
            if (res.data.code == 0){
              //var activityInfo = JSON.stringify(that.data.activityInfo);
              var orderInfo =res.data.order;
              if (orderInfo.orderpic){orderInfo.orderpic = encodeURIComponent(orderInfo.orderpic);}   
              if (orderInfo.qrcode){orderInfo.qrcode = encodeURIComponent(orderInfo.qrcode);}
              console.log(orderInfo);
              orderInfo = JSON.stringify(res.data.order);
              wx.navigateTo({
                url: '/pages/sureOrders/sureOrders?orderInfo='+orderInfo
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
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    var _errImg = e.target.dataset.errImg;
    var businessInfo = this.data.businessInfo
    this.data.businessInfo.businesspic = "/images/defaultImg.png"
    this.setData({ businessInfo: businessInfo })
  }
})