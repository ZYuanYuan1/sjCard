// pages/scoreDetail/scoreDetail.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrShow: true,
    commentShow: true,
    showPhoneModal: false, //手机号绑定弹框
    showModal: false, //会员等级低弹框
    showModalTake: false, //正常领取任务弹框
    showModalCredit: false, //信用分偏低弹框
    businessInfo: {}, //商家信息
    activityInfo: {}, //活动信息
    businessactivityid: '', //商家活动id
    saving: 0, //0是未收藏，1是收藏
    inviteUserPhone: ' ',
    info: [],
    createDate: "",
    addressList: [],
    addressLength: 0,
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //console.log('111');
    var businessactivityid
    if (options.businessactivityid) {
      businessactivityid = options.businessactivityid;
      //console.log('222');
    }

    //来自分享的参数
    if (options.shareparam) {
      // var that=this;
      var info = JSON.parse(options.shareparam);
      businessactivityid = info.businessactivityid;
      var inviteUserPhone = info.level;
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
      console.log(getApp().globalData.invitePeopleNumber);
    }
    this.setData({
      'businessactivityid': businessactivityid
    });

    //加载积分详情
    this.scoreDetail(businessactivityid);

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
            console.log(res.data.info);
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
                count: 0
              })
            }
          }

        })
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

        //用户评价总数量

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
      }
    })
    //店铺地址
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var businessactivityid = this.data.businessactivityid
    console.log(businessactivityid);
    this.scoreDetail(businessactivityid);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */

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
    console.log('000' + inviteUserPhone);
    var shareparam = JSON.stringify({
      level: inviteUserPhone,
      businessactivityid: businessactivityid
    })
    return {
      title: head,
      path: "/pages/scoreDetail/scoreDetail?shareparam=" + shareparam,
      imageUrl: imgUrl
    }
  },
  //初始化页面详情数据
  scoreDetail: function (detailId) {
    console.log(detailId);
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        that.setData({
          inviteUserPhone: userInfo.mobile
        });
        //console.log(userInfo);
        var tokenVal = userInfo.app_token;
        wx.request({
          // + detailId
          url: getApp().apiUrl + '/api/businessactivity/info/' + detailId,
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var hostInfo = res.data.business; //商家信息
              var activityInfo = res.data.businessactivity; //商家活动
              var saving = res.data.isAttention;
              if (activityInfo.shelftime != null && activityInfo.endtime != null) {
                activityInfo.shelftime = activityInfo.shelftime.substring(0, 16);
                activityInfo.endtime = activityInfo.endtime.substring(0, 16);
              }
              that.setData({
                'businessInfo': hostInfo,
                'activityInfo': activityInfo,
                'saving': saving
              });
              //富文本
              var article = activityInfo.content;
              WxParse.wxParse('article', 'html', article, that, 15);

            };

          },

        })
      },
      fail: function () {
        wx.request({
          url: getApp().apiUrl + '/api/businessactivity/info/' + detailId,
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': ""
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var hostInfo = res.data.business; //商家信息
              var activityInfo = res.data.businessactivity; //商家活动
              var saving = res.data.isAttention;
              console.log(activityInfo);
              that.setData({
                'businessInfo': hostInfo,
                'activityInfo': activityInfo,
                'saving': saving
              });
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
  //点击确定-bindPhone组件传过来的信息
  getBindInfo: function (e) {
    console.log(e);
    var bindInfo = e.detail.bindPhone; //true为手机绑定成功，false为手机绑定失败
    if (bindInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.setData({
        'showPhoneModal': false
      }); //绑定手机号成功后影藏弹框
    }
  },
  //跳转到商家课程列表
  skip_lessonList: function () {
    var bussinessId = this.data.businessInfo.businessid;
    console.log(bussinessId);
    wx.navigateTo({
      url: '/pages/lessonList/lessonList?businessId=' + bussinessId,
    })
  },
  preventTouchMove: function () {},
  //点击领取任务按钮-出现弹框
  showDialogBtn: function () {
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
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              //先判断信用等级和信用分
              var grade = res.data.user.grade; //会员等级
              var currGrade = that.data.activityInfo.amount; //当前任务积分
              //待测试
              if (currGrade > 39 && grade <= 0) {
                that.setData({
                  showModalCredit: true
                })
                return false
              } //信用分小于等于3时的弹框
              if (grade < currGrade && grade > 0) {
                that.setData({
                  showModal: true
                })
                return false
              } //会员等级小于当前任务积分时的弹框        
              that.setData({
                showModalTake: true
              })
            } else {
              wx.showToast({
                title: res.errMsg,
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
  //取消升级按钮
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  //去升级按钮
  onConfirm: function () {
    this.setData({
      showModal: false
    });
    wx.navigateTo({
      url: '/pages/memberPromote/memberPromote',
    })
  },
  //弹出正常领取任务弹窗-取消按钮
  onCancelTake: function () {
    this.setData({
      showModalTake: false,
    });
  },
  //弹出正常领取任务弹窗-确定按钮
  onConfirmTake: function () {
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
            'ordertype': 1,
            'businessactivityid': businessactivityid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              that.setData({
                showModalTake: false
              })
              //待完成
              wx.showToast({
                title: '任务领取成功',
                success: function () {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/myTask/myTask',
                    }) //领取成功跳转到-我的任务页面
                  }, 200)
                }
              })
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
    // this.setData({
    //   showModalTake: false
    // });
  },
  //信用分低弹窗（不能领取任务）弹窗-取消按钮
  onCancelCredit: function () {
    this.setData({
      showModalCredit: false
    });
  },
  //去充值信用分
  onConfirmCredit: function () {
    this.setData({
      showModalCredit: false
    });
    wx.navigateTo({
      url: '/pages/creditScore/creditScore',
    });
  },
  //图片出现错误时调用
  errImg: function (e) {
    console.log(e);
    var _errImg = e.target.dataset.errImg;
    var businessInfo = this.data.businessInfo
    this.data.businessInfo.businesspic = "/images/defaultImg.png"
    this.setData({
      businessInfo: businessInfo
    })
  },
  commentAll() {
    wx.navigateTo({
      url: "/pages/commentAll/commentAll?businessActivityId=" + this.data.businessactivityid
    })
  },
  goShop() {
    var bussinessId = this.data.businessInfo.businessid
    wx.navigateTo({
      url: '/pages/lessonList/lessonList?businessId=' + bussinessId,
    })
  },
  changIndex() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  }
})