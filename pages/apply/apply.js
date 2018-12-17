// pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    showModalTake: false,
    businessname:'',//企业名称
    businessProject: '',//经营项目或产品
    touchName:'',//姓名
    touchInviteName:'',//邀请人
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
      that.setData({ "businessType": businessType});
    }
      wx.getStorage({
        key: 'loginStutes',
        success: function(res) {
          console.log(res);
        },
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
  getBindInfo:function(e){
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.submitApply();
    }
  },
  //绑定企业名称
  businessname:function(e){
    var businessname = e.detail.value;
    this.setData({ businessname: businessname });
  },
  //绑定经营项目
  businessProject: function (e) {
    console.log(e);
    var businessProject = e.detail.value;
    this.setData({ businessProject: businessProject });
  },
  //绑定input姓名
  touchName:function(e){
    console.log(e);
    var touchName=e.detail.value;
    this.setData({touchName:touchName});
  },
  
  touchInviteName:function(e) {
    console.log(e);
    var touchInviteName = e.detail.value;
    this.setData({ touchInviteName: touchInviteName });
  },
  //绑定input电话
  touchPhone:function(e){
    console.log(e);
    var touchPhone = e.detail.value;
    this.setData({touchPhone:touchPhone});
  },
  //点击提交
  submitApply:function(){
    var that=this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        var businessname =that.data.businessname.trim();
        var businessProject = that.data.businessProject.trim();
        var touchName = that.data.touchName.trim();
        var touchInviteName = that.data.touchInviteName.trim();
        
       // var touchPhone = that.data.touchPhone.trim();
        if (!businessname) {
          wx.showToast({
            title: '企业名称不能为空',
            icon: 'none'
          });
          return false
        };
        if (!businessProject) {
          wx.showToast({
            title: '经营项目或产品不能为空',
            icon: 'none'
          });
          return false
        };
        if (!touchName) {
          wx.showToast({
            title: '联系人姓名不能为空',
            icon: 'none'
          });
          return false
        };
        that.setData({
          showModalTake: true
        })
        console.log(touchInviteName);
        
      },
      fail: function (res) {
        that.setData({'showPhoneModal':true});
      }
    })
  },
  //弹出正常领取任务弹窗-取消按钮
  onCancelTake: function () {
    this.setData({
      showModalTake: false
    });
  },
  onConfirmTake:function(){
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        //that.setData({ 'userInfo': userInfo });
        var businessname = that.data.businessname.trim();
        var businessProject = that.data.businessProject.trim();
        var touchName = that.data.touchName.trim();
        var touchInviteName = that.data.touchInviteName.trim();
        var businessType = that.data.businessType;
        // var touchPhone = that.data.touchPhone.trim();
        if (!businessname) {
          wx.showToast({
            title: '企业名称不能为空',
            icon: 'none'
          });
          return false
        };
        if (!businessProject) {
          wx.showToast({
            title: '经营项目或产品不能为空',
            icon: 'none'
          });
          return false
        };
        if (!touchName) {
          wx.showToast({
            title: '联系人姓名不能为空',
            icon: 'none'
          });
          return false
        };
        wx.request({
          url: getApp().apiUrl + '/api/business/save',
          method: 'post',
          data: { 'businessname': businessname, 'linkname': touchName, 'businessproject': businessProject, 'invitename': touchInviteName, 'businesstype': businessType },
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              wx.showToast({
                title: '申请成功',
              });
              wx.navigateTo({
                url: '/pages/reviewing/reviewing',
              })
            } else {
              // wx.showToast({
              //   title: res.data.msg,
              //   icon: 'none',
              //   duration: 2000
              // })
              wx.navigateTo({
                url: '/pages/reviewing/reviewing',
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