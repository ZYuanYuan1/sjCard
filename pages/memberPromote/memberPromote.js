// pages/memberPromote/memberPromote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    currgrade:'',//当前会员等级
    radioItems: [
      { name: '金卡', image: "https://img.sahuanka.com/sjCard/images/leveltwo.png", value: '1', text: "会员权益：可报名领赏0-99撒欢宝的商家任务。邀请好友成为付费会员可以获得10%的撒欢宝奖励。", permoney: 99},
      { name: '白金卡', image: "https://img.sahuanka.com/sjCard/images/levelthree.png", value: '2', text: "会员权益：可报名领赏0-299撒欢宝的商家任务。邀请好友成为付费会员可以获得13%的撒欢宝奖励。", permoney: 299},
      { name: '钻石卡', image: "https://img.sahuanka.com/sjCard/images/levelfour.png", value: '3', text:"会员权益：可报名领赏0-499撒欢宝的商家任务。邀请好友成为付费会员可以获得16%的撒欢宝奖励。", permoney: 499 },
      { name: '荣耀卡', image: "https://img.sahuanka.com/sjCard/images/levelfive.png", value: '4', text: "会员权益：可报名领赏0-999撒欢宝的商家任务。邀请好友成为付费会员可以获得20%的撒欢宝奖励。", permoney: 999 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化函数
    this.initCurrMember();
  },
  //初始化默认会员
  initCurrMember:function(){
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
            var currgrade = info.grade;
            var memberList = that.data.radioItems;
            for (var i = 0; i < memberList.length; i++) {
              if (currgrade >= memberList[i].permoney) {
                memberList[i].disabled = true
              } else {
                memberList[i].disabled = false
              }
            };
            that.setData({ radioItems: memberList, currgrade: currgrade });
          }

        })        
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
    //初始化函数
    this.initCurrMember();
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
  //点击确定购买-创建订单
  sureBuyMember:function(){
    var radioItems = this.data.radioItems;
    var radioValue;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].checked) {
        radioValue=radioItems[i].value;
      } 
    }
    if (!radioValue){
      wx.showToast({
        title: '请选择会员等级',
        icon:'none'
      })
      return
    }
    console.log(radioValue);
    //创建支付订单
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res){
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: { 'ordertype': 2,'businessactivityid':radioValue},
          header: {'content-type': "application/x-www-form-urlencoded", 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
             // var activityInfo = that.data.activityInfo;
              var orderInfo = res.data.order;
              orderInfo = JSON.stringify(res.data.order);
              //待完成-需拼接一个-创建订单成功后的对象
              wx.navigateTo({
                url: '/pages/myorder/myorder?creditOrderInfo=' + orderInfo
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
      //初始化函数
      this.initCurrMember();
    }
  },
  //单选框选择值时
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
      if (radioItems[i].checked){
        radioItems[i].showYellow=true;
      }else{
        radioItems[i].showYellow=false;
      }
    }
    this.setData({
      radioItems: radioItems
    });
    console.log(radioItems);
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
  // 当密码输入框输入数字6位数时的自定义函数
  valueSix() {
    console.log("1");
    // 模态交互效果
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000
    })
  },
  //当会员等级最高的时候-点击确认购买按钮
  buytip:function(){
    wx.showToast({
      title: '您已经是会员最高等级',
      icon: 'none',
      duration: 2000
    })
  }

})
 