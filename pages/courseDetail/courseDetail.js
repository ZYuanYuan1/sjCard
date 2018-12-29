// pages/courseDetail/courseDetail.js

var util = require('../../utils/util.js');

var WxParse = require('../../wxParse/wxParse.js');
Page({



  /**
 
   * 页面的初始数据
 
   */

  data: {
    addrShow: true,
    addressList: [], //地址
    createDate: "",
    info: [], //最新评价信息
    count: 0, //用户评价总数
    goodsNumber: 0, //售出多少件

    buyNumber: 1,

    buyNumMin: 1,

    buyNumMax: 11,

    course_name: "喵喵喵",

    pingjia: "环境好，教学一流，超喜欢no~哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈",

    course_time: "10月8号",

    showPhoneModal: false, //手机号绑定弹框

    businessactivityid: '', //课程详情
    activitytype: 0,

    businessInfo: {}, //商家信息

    activityInfo: {}, //活动信息

    inviteUserPhone: '',

    saving: 0,

    ifShow: true,

    starImg: [],
    commentShow: true,
    addressLength: 0,

    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车

    Type: [{
      title: "规格",
      years: [{
        year: "三个月",
        acount: 10
      }, {
        year: "半年",
        acount: 20
      }, {
        year: "一年",
        acount: 0
      }]
    }],

    chooseyear: ""

  },

  /**
 
   * 生命周期函数--监听页面加载
 
   */

  onLoad: function (options) {
    console.log(options)
    this.setData({
      activitytype: options.activitytype
    })
    var courseDetailId

    if (options.businessactivityid) {
      courseDetailId = options.businessactivityid;
      //console.log('222');
    }

    //来自分享的参数

    if (options.shareparam) {
      var info = JSON.parse(options.shareparam);
      courseDetailId = info.businessactivityid;
      var inviteUserPhone = info.level;
      var activitytype = info.activitytype
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
    }

    this.setData({
      'businessactivityid': courseDetailId,
      'activitytype': activitytype || options.activitytype
    });
    this.initPageDetail(courseDetailId);

    //已售多少件
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/order/number/' + options.businessactivityid,
          method: "get",
          data: {
            businessactivityid: options.businessactivityid
          },
          header: {
            'Authorization': tokenVal
          },
          success(res) {
            that.setData({
              goodsNumber: res.data.number
            })
          }
        })

        //店铺地址
        wx.request({
          url: getApp().apiUrl + '/api/business/address/list/' + options.businessid,
          success(res) {
            // console.log(res.data.list.length);
            if (res.data.code == 0 && res.data.list.length != 0) {
              that.setData({
                addressList: res.data.list,
                addressLength: res.data.list.length,
                addrShow: false
              })
            } else {
              that.setData({
                addressLength: 0
              })
            }
          }
        })

        wx.request({
          url: getApp().apiUrl + '/api/comment/total/' + that.data.businessactivityid,
          data: ({
            businessActivityId: that.data.businessactivityid
          }),
          method: 'get',
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res.data.info.count)
            if (res.data.code == 0 && res.data.info.count != 0) {
              that.setData({
                count: res.data.info.count,
                commentShow: false
              })
            }
          }
        })

        //用户评价
        wx.request({
          url: getApp().apiUrl + '/api/comment/latest/' + that.data.businessactivityid,
          data: ({
            businessActivityId: that.data.businessactivityid
          }),
          header: {
            'Authorization': tokenVal,
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'get',
          success(res) {
            if (res.data.code == 0 && res.data.info != null) {
              var createdate = res.data.info.createTime;
              var createMonth = createdate.substring(5, 7);
              var createDay = createdate.substring(8, 10);
              var starArr = [];
              for (var i = 0; i < res.data.info.score; i++) {
                starArr.push("http://img.sahuanka.com/sjCard/images/star.png")
              };
              that.setData({
                info: res.data.info,
                createDate: createMonth + "月" + createDay + "日",
                starImg: starArr
              })
            } else {
              that.setData({
                count: 0,
              })
            }
          }

        })
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
    var activitytype = this.data.activitytype
    // console.log('000' + inviteUserPhone);
    var shareparam = JSON.stringify({
      level: inviteUserPhone,
      businessactivityid: businessactivityid,
      activitytype: activitytype
    })
    return {
      title: head,
      path: "/pages/courseDetail/courseDetail?shareparam=" + shareparam,
      imageUrl: imgUrl
    }

  },

  //点击确定-bindPhone组件传过来的信息

  getBindInfo: function (e) {
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      this.setData({
        'showPhoneModal': false
      }); //绑定手机号成功后影藏弹框
    }
  },

  initPageDetail: function (courseId) {

    console.log(courseId);

    var that = this;

    wx.getStorage({

      key: 'loginStutes',

      success: function (res) {

        var userInfo = JSON.parse(res.data);

        that.setData({
          inviteUserPhone: userInfo.mobile
        });

      },

    })
    wx.request({
      url: getApp().apiUrl + '/api/businessactivity/info/' + that.data.businessactivityid,

      method: 'post',

      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {

        console.log(res);

        if (res.data.code == 0) {

          var hostInfo = res.data.business; //商家信息

          var activityInfo = res.data.businessactivity; //商家活动

          //console.log(activityInfo);

          that.setData({
            'businessInfo': hostInfo,
            'activityInfo': activityInfo
          });

          //富文本

          var article = activityInfo.content;

          //article.replace(/\<img/gi, '<img style="max-width:100%;height:auto;width:100px;"')

          WxParse.wxParse('article', 'html', article, that, 15);

          // var data = res.data.page.list;

          // that.setData({ 'homeList': homeList });

        };



      },



    })

  },

  //跳转至确认订单页面

  sureOrders: function () {
    console.log();
    //创建支付订单

    var that = this;

    var businessactivityid = that.data.businessactivityid;
    var activitytype = that.data.activitytype;
    var ordertype
    if (activitytype == 2) {
      ordertype = 7
    } else {
      ordertype = 6
    }
    console.log(ordertype);
    wx.getStorage({

      key: 'loginStutes',

      success: function (res) {

        //console.log(res);

        var userInfo = JSON.parse(res.data);

        //console.log(userInfo);

        var tokenVal = userInfo.app_token;
        wx.request({

          url: getApp().apiUrl + '/api/order/creatOrder',

          method: 'post',

          data: {
            'ordertype': ordertype,
            'businessactivityid': businessactivityid
          },

          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },

          success: function (res) {

            console.log(res);

            if (res.data.code == 0) {

              var activityInfo = that.data.activityInfo;

              var orderInfo = res.data.order;

              if (orderInfo.orderpic) {
                orderInfo.orderpic = encodeURIComponent(orderInfo.orderpic);
              }

              if (orderInfo.qrcode) {
                orderInfo.qrcode = encodeURIComponent(orderInfo.qrcode);
              }

              console.log(orderInfo);

              orderInfo = JSON.stringify(res.data.order);

              wx.navigateTo({

                url: '/pages/myorder/myorder?orderInfo=' + orderInfo

              }) //领取成功跳转到-确认订单页面

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

        that.setData({
          'showPhoneModal': true
        });

      }

    })

  },

  skip_lessonList: function () {

    var bussinessId = this.data.businessInfo.businessid
    console.log(bussinessId);

    wx.navigateTo({

      url: '/pages/lessonList/lessonList?businessId=' + bussinessId,

    })

  },

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

            data: {
              'businessid': storeId
            },

            header: {
              'content-type': 'text/html;charset=UTF-8',
              'Authorization': tokenval
            },

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

            data: {
              'businessid': storeId
            },

            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': tokenval
            },

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

        that.setData({
          'showPhoneModal': true
        });

      }

    });

  },

  //显示弹窗

  toAddShopCar() {

    this.setData({

      ifShow: false,

      shopType: "addShopCar"

    })

  },

  // 关闭弹窗

  close() {

    this.setData({

      ifShow: true

    })

  },

  //购物车减

  numJianTap() {

    if (this.data.buyNumber > this.data.buyNumMin) {

      var currentNum = this.data.buyNumber;

      currentNum--;

      this.setData({

        buyNumber: currentNum

      })

    }

  },

  numJiaTap() {

    if (this.data.buyNumber < this.data.buyNumMax) {

      var currentNum = this.data.buyNumber;

      currentNum++;

      this.setData({

        buyNumber: currentNum

      })

    }

  },

  goShopCar() {

    wx.navigateTo({

      url: '/pages/myshopping/myshopping',

    })

  },

  tobuy() {

    // this.setData({

    //   ifShow: false,

    //   shopType:"tobuy"

    // });

    wx.navigateTo({

      url: '/pages/myorder/myorder'

    })

  },

  makeSure(e) {

    var shoptype = e.target.dataset.shoptype;

    console.log(e.target.dataset.shoptype);

    if (shoptype == "addShopCar") {

      wx.navigateTo({

        url: '/pages/myshopping/myshopping'

      })
    };

    if (shoptype == "tobuy") {

      wx.navigateTo({

        url: '/pages/myorder/myorder'

      })

    }

  },

  chooseType(e) {

    console.log(e.currentTarget.dataset.chooseyear)

    console.log(e.currentTarget.dataset.acount)

    var chooseyear = e.currentTarget.dataset.chooseyear;

    var acount = e.currentTarget.dataset.acount

    this.setData({

      chooseyear: chooseyear

    });

    if (acount <= 0) {



    }

  },

  //收藏
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
            data: {
              'businessid': storeId
            },
            header: {
              'content-type': 'text/html;charset=UTF-8',
              'Authorization': tokenval
            },
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
            data: {
              'businessid': storeId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': tokenval
            },
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
        that.setData({
          'showPhoneModal': true
        });
      }
    });
  },
  goShop() {
    var bussinessId = this.data.businessInfo.businessid
    wx.navigateTo({
      url: '/pages/lessonList/lessonList?businessId=' + bussinessId,
    })
  },
  commentAll() {
    var that = this
    wx.navigateTo({
      url: '/pages/commentAll/commentAll?businessActivityId=' + that.data.businessactivityid,
    })
    console.log(that.data.businessactivityid)
  },
  //确认订单
  skip_sureOrders: function () {
    //创建支付订单
    var that = this;
    var businessactivityid = that.data.businessactivityid;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        //console.log(res);
        var userInfo = JSON.parse(res.data);
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          url: getApp().apiUrl + '/api/order/creatOrder',
          method: 'post',
          data: {
            'ordertype': 6,
            'businessactivityid': businessactivityid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var activityInfo = that.data.activityInfo;
              var orderInfo = res.data.order;
              if (orderInfo.orderpic) {
                orderInfo.orderpic = encodeURIComponent(orderInfo.orderpic);
              }
              if (orderInfo.qrcode) {
                orderInfo.qrcode = encodeURIComponent(orderInfo.qrcode);
              }
              console.log(orderInfo);
              orderInfo = JSON.stringify(res.data.order);
              wx.navigateTo({
                url: '/pages/myorder/myorder?orderInfo=' + orderInfo
              }) //领取成功跳转到-确认订单页面
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
        that.setData({
          'showPhoneModal': true
        });
      }
    })
  },
  changIndex() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  }
})