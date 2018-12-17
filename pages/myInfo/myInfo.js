// pages/myAccount/myAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhoneModal: false,//手机号绑定弹框
    userInfo: {},//用户信息
    genderIndex:0,
    gender: ['男', '女'],
    isHide:true,
    isHide1: true,
    isHide2: true,
    isHide3: true,
    isHide4: true,
    isHide5: true,
    isHide9: true,
    getNameVal: '',//实时监听input的值
    getParentNameVal: '',//实时监听input的值
    getDabaoNameVal: '',//实时监听input的值
    getDabaoGenderVal: '',//实时监听input的值
    getDabaoBirthdayVal: '',//实时监听input的值
    getErbaoNameVal: '',//实时监听input的值
    getErbaoGenderVal: '',//实时监听input的值
    getErbaoBirthdayVal: '',//实时监听input的值
    getAddressVal: ''//实时监听input的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initInfoFun();
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
    var userObj = this.data.userInfo;
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
  //初始化页面
  initInfoFun: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  initAccountInfo: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
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
            var info = res.data.user;
            that.setData({ 'userInfo': info });
          }

        })
        //that.setData({ 'userInfo': userInfo });
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  tap: function (target) {
    var that = this;
    console.log(target.currentTarget.id);
    switch (target.currentTarget.id) {
      case '0':
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            wx.showToast({
              title: '请稍候...',
              icon: 'loading',
              duration: 10000,
              mask: true
            })

            wx.getStorage({
              key: 'loginStutes',
              success: function (r) {
                //console.log(res);
                var userInfo = JSON.parse(r.data);
                //console.log(userInfo);
                var tokenVal = userInfo.app_token;
                console.log(tokenVal);
                      wx.uploadFile({
                        url: getApp().apiUrl + '/api/user/uploadimg',
                        method: 'post',
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        data: {},
                        header: { 'content-type': 'multipart/form-data', 'Authorization': 'tokenVal' },
                        success: function (uploadimgres) {
                          var data = JSON.parse(uploadimgres.data)
                         // console.log(uploadimgres.data);
                          var info = data.user;
                          console.log(info);
                          that.setData({ 'userInfo': info });
                          wx.hideToast();
                        }
                      });
                },
                fail: function () {
                  that.setData({ 'showPhoneModal': true });
                }
             })
          }
        })
        break
      case '1':
        that.setData({isHide:false});
        that.setData({ isHide1: false });
        wx.setNavigationBarTitle({
          title: '修改昵称'
        })
        break
      case '2':
        that.setData({ isHide: false });
        that.setData({ isHide2: false });
        wx.setNavigationBarTitle({
          title: '修改家长姓名'
        })
        break
      case '3':
        that.setData({ isHide: false });
        that.setData({ isHide3: false });
        wx.setNavigationBarTitle({
          title: '修改孩子姓名'
        })
        break
      case '4':
        that.setData({ isHide: false });
        that.setData({ isHide4: false });
        wx.setNavigationBarTitle({
          title: '修改孩子性别'
        })
        break
      case '5':
        that.setData({ isHide: false });
        that.setData({ isHide5: false });
        wx.setNavigationBarTitle({
          title: '修改孩子生日'
        })
        break
      case '6':
        that.setData({ isHide: false });
        that.setData({ isHide6: false });
        wx.setNavigationBarTitle({
          title: '修改二宝姓名'
        })
        break
      case '7':
        that.setData({ isHide: false });
        that.setData({ isHide7: false });
        wx.setNavigationBarTitle({
          title: '修改二宝性别'
        })
        break
      case '8':
        that.setData({ isHide: false });
        that.setData({ isHide8: false });
        wx.setNavigationBarTitle({
          title: '修改二宝生日'
        })
        break
      default:
    }
  },
  //实时监听input的值
  getNameVal:function(e){
    console.log(e);
    var nameVal=e.detail.value;
    this.setData({getNameVal:nameVal});
  },
  //实时监听input的值
  getParentNameVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    this.setData({ getParentNameVal: nameVal });
  },
  //实时监听input的值
  getDabaoNameVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    this.setData({ getDabaoNameVal: nameVal });
  },
  //实时监听input的值
  getDabaoGenderVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    var str = 'userInfo.dabaogender';
    this.setData({
      [str]: this.data.gender[e.detail.value]
    })
  },
  //实时监听input的值
  getDabaoBirthdayVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    var str = 'userInfo.dabaobirthday';
    //this.setData({ getDabaoBirthdayVal: nameVal });
    this.setData({ [str]: nameVal });
  },
  //实时监听input的值
  getErbaoNameVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    this.setData({ getErbaoNameVal: nameVal });
  },
  //实时监听input的值
  getErbaoGenderVal: function (e) {
    console.log(e.detail);
    var str = 'userInfo.erbaogender';
    this.setData({
      [str]: this.data.gender[e.detail.value]
    })
  },

  //实时监听input的值
  getErbaoBirthdayVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    var str = 'userInfo.erbaobirthday';
    this.setData({ [str]: nameVal });
  },
  //实时监听input的值
  getAddressVal: function (e) {
    console.log(e);
    var nameVal = e.detail.value;
    this.setData({ getAddressVal: nameVal });
  },
  
  //确认修改昵称
  modifyName:function(e){
    var that=this;
    var nameVal = this.data.getNameVal;
    //待完成-确认修改成功后的操作
    var data = { username : nameVal}
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    }) 
  },
  //确认修改家长姓名
  modifyParentName: function (e) {
    var that = this;
    var nameVal = this.data.getParentNameVal;
    //待完成-确认修改成功后的操作
    var data = { parentname: nameVal }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改大宝名字
  modifyDabaoName: function (e) {
    var that = this;
    var nameVal = this.data.getDabaoNameVal;
    //待完成-确认修改成功后的操作
    var data = { dabaoname: nameVal }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改大宝性别
  modifyDabaoGender: function (e) {
    var that = this;
    var nameVal = this.data.getDabaoGenderVal;
    //待完成-确认修改成功后的操作
    var data = { dabaogender: that.data.userInfo.dabaogender }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改大宝生日
  modifyDabaoBirthday: function (e) {
    var that = this;
    var nameVal = this.data.getDabaoBirthdayVal;
    //待完成-确认修改成功后的操作
    var data = { dabaobirthday: that.data.userInfo.dabaobirthday }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改二宝姓名
  modifyErbaoName: function (e) {
    var that = this;
    var nameVal = this.data.getErbaoNameVal;
    //待完成-确认修改成功后的操作
    var data = { erbaoname: nameVal }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改二宝性别
  modifyErbaoGender: function (e) {
    var that = this;
    var nameVal = this.data.getErbaoGenderVal;
    //待完成-确认修改成功后的操作
    var data = { erbaogender: that.data.userInfo.erbaogender }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改二宝生日
  modifyErbaoBirthday: function (e) {
    var that = this;
    var nameVal = this.data.getErbaoBirthdayVal;
    //待完成-确认修改成功后的操作
    var data = { erbaobirthday: that.data.userInfo.erbaobirthday }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //确认修改我的地址
  modifyAddress: function (e) {
    var that = this;
    var nameVal = this.data.getAddressVal;
    //待完成-确认修改成功后的操作
    var data = { address: nameVal }
    wx.getStorage({
      key: 'loginStutes',
      success: function (r) {
        //console.log(res);
        var userInfo = JSON.parse(r.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        //console.log(tokenVal);
        wx.request({
          url: getApp().apiUrl + '/api/user/update',
          method: 'post',
          data: data,
          header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
          success: function (res) {
            console.log(res);
            var userInfo = res.data.user;
            //userInfo.username = nameVal;
            that.setData({ isHide: true, isHide1: true, isHide2: true, isHide3: true, isHide4: true, isHide5: true, isHide6: true, isHide7: true, isHide8: true, isHide9: true, userInfo: userInfo });
            wx.setNavigationBarTitle({
              title: '我的信息'
            });
          },
          fail: function () {
            console.log('操作失败');
          }

        })
      },
      fail: function () {
        that.setData({ 'showPhoneModal': true });
      }
    })
  },
  //点击确定-bindPhone组件传过来的信息
  getBindInfo:function(e){
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo){
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.initAccountInfo();
    }
  },
  //地址管理
  addMan(){
    wx.navigateTo({
      url: '/pages/address_add/address_add',
      success: function(res) {},
      fail: function(res) {},
    })
  }
})