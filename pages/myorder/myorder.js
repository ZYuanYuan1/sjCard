// pages/sureOrders/sureOrders.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    showPhoneModal: false,//手机号绑定弹框
    orderName: '',//姓名
    orderPhone: '',//手机
    orderCard: '',//身份证
    orderDate: '',//日期
    remark: '',
    showModal: false,//去支付弹框
    orderInfo: {},//详情页传过来的订单
    creditOrderInfo: {},//信用分和会员传过来的订单信息
    fromMyOrder: {},//订单-"去支付"按钮传过来的订单信息
    waystype: "",//0为详情页传过来的订单，1为信用分和会员传过来的订单信息，2订单-"去支付"按钮传过来的订单信息
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: false,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "80rpx",//输入框高度
      width: "490rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //详情传过来的订单信息
    if (options.orderInfo) {
      var orderInfo = JSON.parse(options.orderInfo);
      console.log(orderInfo);
      if (orderInfo.orderpic) { orderInfo.orderpic = decodeURIComponent(orderInfo.orderpic); }
      if (orderInfo.qrcode) { orderInfo.qrcode = decodeURIComponent(orderInfo.qrcode); }
      console.log("111" + orderInfo);
      console.log("111" + orderInfo.ordertype);
      var waystype = 0;
      if (orderInfo.ordertype == 7) {
        waystype = 7;
      }
      this.setData({ orderInfo: orderInfo, waystype: waystype });
    }
    //信用分和会员传过来的订单信息
    if (options.creditOrderInfo) {
      var creditOrderInfo = JSON.parse(options.creditOrderInfo);
      console.log(creditOrderInfo);
      this.setData({ creditOrderInfo: creditOrderInfo, waystype: 1 });
    }
    //订单-"去支付"按钮传过来的订单信息
    if (options.fromMyOrder) {
      var fromMyOrder = JSON.parse(options.fromMyOrder);
      if (fromMyOrder.orderpic) { fromMyOrder.orderpic = decodeURIComponent(fromMyOrder.orderpic); }
      if (fromMyOrder.qrcode) { fromMyOrder.qrcode = decodeURIComponent(fromMyOrder.qrcode); }
      console.log(fromMyOrder);
      //this.setData({ fromMyOrder: fromMyOrder, waystype:2});
      console.log("111" + fromMyOrder);
      console.log("111" + fromMyOrder.ordertype);
      var waystype = 0;
      if (fromMyOrder.ordertype == 7) {
        waystype = 7;
      }
      this.setData({ orderInfo: fromMyOrder, waystype: waystype });
    }
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
    this.innitShoppingAddr()
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
  // 初始化地址
  innitShoppingAddr() {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/userAddr/list',
          header: {
            'Authorization': tokenVal,
            'content-type': 'x-www-form-urlencoded'
          },
          method: "get",
          success(res) {
            console.log(res);
            if (res.data.code == 0 && res.data.list.length != 0) {
              that.setData({
                addressList: res.data.list[0],
                
              });
            } else {
              that.setData({
                addressList: null
              });
            }
          }
        })
      }
    })
  },

  //绑定input姓名
  orderName: function (e) {
    console.log(e);
    var orderName = e.detail.value;
    this.setData({ orderName: orderName });
  },
  //绑定input手机
  orderPhone: function (e) {
    console.log(e);
    var orderPhone = e.detail.value;
    this.setData({ orderPhone: orderPhone });
  },
  //绑定input身份证
  orderCard: function (e) {
    console.log(e);
    var orderCard = e.detail.value;
    this.setData({ orderCard: orderCard });
  },
  //绑定input日期
  orderDate: function (e) {
    console.log(e);
    var orderDate = e.detail.value;
    this.setData({ orderDate: orderDate });
  },
  remark: function (e) {
    console.log(e);
    var remark = e.detail.value;
    this.setData({ remark: remark });
  },

  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone;//true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.setData({ showPhoneModal: false });
    }
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
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    var _errImg = e.target.dataset.errImg;
    var fromMyOrder = this.data.fromMyOrder
    this.data.fromMyOrder.orderpic = "/images/defaultImg.png"
    this.setData({ fromMyOrder: fromMyOrder })
  },
  errImgDetail: function (e) {
    console.log(e);
    var _errImg = e.target.dataset.errImg;
    var orderInfo = this.data.orderInfo
    this.data.orderInfo.orderpic = "/images/defaultImg.png"
    this.setData({ orderInfo: orderInfo })
  },
  //确定购买-微信支付
  wxpay: function (e) {
    var that = this;
    console.log(that.data.addressList);
    if (that.data.addressList==null){
      wx.showModal({
        title: '提交失败',
        content: '请先完善您的地址',
      })
    }else{
    console.log("123" + e.target.dataset.orderType);
    var ordertype = e.target.dataset.orderType;
    var orderId = e.target.dataset.orderId;
    var orderNumber = e.target.dataset.orderNumber;
    //this.setData({ showPhoneModal: false });
    var remark = that.data.remark.trim();
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        console.log('======' + tokenVal);
        //that.setData({ 'userInfo': userInfo });
        //先保存信息--判断订单类型是否是7
        if (ordertype == 7) {
          var orderName = that.data.orderName.trim();
          var orderPhone = that.data.orderPhone.trim();
          var orderCard = that.data.orderCard.trim();
          var orderDate = that.data.orderDate.trim();
          if (!orderName) {
            wx.showToast({
              title: '姓名不能为空',
              icon: 'none'
            });
            return false
          };
          var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
          if (!myreg.test(orderPhone)) {
            wx.showToast({
              title: '手机号有误',
              icon: 'none'
            });
            return
          };
          if (!orderCard) {
            wx.showToast({
              title: '身份证不能为空',
              icon: 'none'
            });
            return false
          };
          if (!orderDate) {
            wx.showToast({
              title: '日期不能为空',
              icon: 'none'
            });
            return false
          };

          wx.request({
            url: getApp().apiUrl + '/api/order/update',
            method: 'post',
            data: { 'orderid': orderId, 'ordername': orderName, 'orderphone': orderPhone, 'ordercard': orderCard, 'orderdate': orderDate, 'remark': remark, 'addressId': that.data.addressList.userAddrId},
            header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                console.log('修改门票订单成功');
                wx.request({
                  url: getApp().apiUrl + '/api/order/creatPayOrder',
                  method: 'post',
                  data: { 'orderid': orderId, addressId: that.data.addressList.userAddrId},
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

                          var currType = that.data.waystype;
                          if (currType == 1) {
                            console.log('升级和会员')
                            wx.navigateBack({
                              delta: 1
                            })
                          } else {
                            wx.showToast({
                              title: '支付成功',
                              icon: 'none',
                              duration: 2000
                            });
                            wx.redirectTo({
                              url: '/pages/myOrders/myOrders'
                            })
                          }
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
              } else {
                wx.showToast({
                  title: '系统异常',
                  icon: 'none'
                });
                return false
              };

            },

          })
        } else if (ordertype == 6 && remark != '') {
          console.log('remark' + remark);
          wx.request({
            url: getApp().apiUrl + '/api/order/update',
            method: 'post',
            data: { 'orderid': orderId, 'remark': remark, 'addressId': that.data.addressList.userAddrId },
            header: { 'content-type': 'text/html;charset=UTF-8', 'Authorization': tokenVal },
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                console.log('修改产品订单成功');
                wx.request({
                  url: getApp().apiUrl + '/api/order/creatPayOrder',
                  method: 'post',
                  data: { 'orderid': orderId, 'addressId': that.data.addressList.userAddrId },
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

                          var currType = that.data.waystype;
                          if (currType == 1) {
                            console.log('升级和会员')
                            wx.navigateBack({
                              delta: 1
                            })
                          } else {
                            wx.showToast({
                              title: '支付成功',
                              icon: 'none',
                              duration: 2000
                            });
                            wx.redirectTo({
                              url: '/pages/myOrders/myOrders'
                            })
                          }
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
              } else {
                wx.showToast({
                  title: '系统异常',
                  icon: 'none'
                });
                return false
              };

            },

          })
        } else {
          wx.request({
            url: getApp().apiUrl + '/api/order/creatPayOrder',
            method: 'post',
            data: { 'orderid': orderId, 'addressId': that.data.addressList.userAddrId},
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

                    var currType = that.data.waystype;
                    if (currType == 1) {
                      console.log('升级和会员')
                      wx.navigateBack({
                        delta: 1
                      })
                    } else {
                      wx.showToast({
                        title: '支付成功',
                        icon: 'none',
                        duration: 2000
                      });
                      wx.redirectTo({
                        url: '/pages/myOrders/myOrders'
                      })
                    }
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
      },
      fail: function (res) {
        that.setData({ 'showPhoneModal': true });
      }
    })
    }
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
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/address?addressList=" + JSON.stringify(this.data.addressList)
    })
    console.log(this.data.addressList)
  },
  addAddress(){
    wx.navigateTo({
      url: "/pages/address_add/address_add"
    })
  }
})