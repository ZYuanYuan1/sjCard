// pages/invite_bonus/invite_bonus.js
var util = require('../../utils/util.js');
var page = 1;
var hadLastPage = false;

const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

const base64src = function (base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      },
    })
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'homeList': [], //页面主列表
    'reachBottomTip': false,
    'inviteUserPhone': '',
    //海报相关
    img: '',
    nickName: '',
    template: {},
    shareImage: '',
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    hadLastPage = false;
    that.loadInvite();
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
  //初始化页面
  loadInvite: function () {
    var that = this;
    if (hadLastPage != false) {
      that.setData({
        reachBottomTip: true
      });
      return;
    };
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        that.setData({
          inviteUserPhone: userInfo.mobile,
          nickName: userInfo.username
        });
        that.innitQRcode(tokenVal)
        wx.request({
          url: getApp().apiUrl + '/api/user/list',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': tokenVal
          },
          data: {
            'limit': 10,
            'page': page
          },
          success: function (res) {
            // console.log(res);
            if (res.data.code == 0) {
              var homeList = that.data.homeList;
              var data = res.data.page.list;
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  homeList.push(data[i]);
                }
              }
              if (res.data.page.currPage == res.data.page.totalPage) {
                hadLastPage = res.data.page.currPage;
              } else {
                page++;
              };
              that.setData({
                'homeList': homeList
              });
            };
          },
        })
      },
      fail: function (res) {
        //that.setData({ 'showPhoneModal': true });
        wx.request({
          url: getApp().apiUrl + '/api/user/list',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': ""
          },
          data: {
            'limit': 10,
            'page': page
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              var homeList = that.data.homeList;
              var data = res.data.page.list;
              if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  homeList.push(data[i]);
                }
              }
              if (res.data.page.currPage == res.data.page.totalPage) {
                hadLastPage = res.data.page.currPage;
              } else {
                page++;
              };
              that.setData({
                'homeList': homeList
              });
            };

          },

        })
      }
    })
  },
  onReachBottom: function () {
    this.loadInvite(); //加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({
      homeList: [],
      'reachBottomTip': false
    }); //将数据清空
    this.loadInvite();
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击邀请好友按钮分享
   */
  onShareAppMessage: function (res) {
    // console.log(res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    var inviteUserPhone = this.data.inviteUserPhone;
    console.log('000' + inviteUserPhone);
    //var shareparam = JSON.stringify({ level: inviteUserPhone, businessactivityid: businessactivityid })
    return {
      title: '赏金宝贝',
      path: "/pages/index/index?inviteUserPhone=" + inviteUserPhone,
      imageUrl: 'https://img.sahuanka.com/sjCard/images/home_banner.png'
    }
  },
  //跳转到邀请有奖说明
  skip_invite_bonus_intro: function () {
    wx.navigateTo({
      url: '/pages/invite_bonus_intro/invite_bonus_intro',
    })
  },
  //跳转到邀请商家有奖说明
  skip_invite_business_info: function () {
    wx.navigateTo({
      url: '/pages/invite_business_info/invite_business_info',
    })
  },


  /**
   * ------分享海报-------
   */

  // 点击生成海报
  handleSharePoster() {
    let that = this
    wx.showLoading({
      title: '生成分享海报中',
      mask: true
    })

    const imgPromise = new Promise((resolve, reject) => {
      setTimeout(function timer() {
        if (that.data.img) {
          resolve()
        }
      }, 500)
    })

    imgPromise.then(() => {
      base64src(this.data.img).then(res => {
        let qrcode = res
        wx.getImageInfo({
          src: 'https://img.sahuanka.com/sjCard/images/poster_bg3.jpg',
          success: function (res) {
            that.setData({
              showModal: true,
              template: that.palette(res.path, qrcode, that.data.nickName)
            })
          }
        })
      })
    })
  },

  // 海报模版数据
  palette(bg, qr_code, nickName) {
    return ({
      width: '558rpx',
      height: '992rpx',
      background: bg,
      views: [{
          type: 'image',
          url: qr_code,
          css: {
            width: '120rpx',
            height: '120rpx',
            left: '405rpx',
            top: '830rpx',
            borderRadius: '60rpx'
          }
        }
        ,
        {
          type: 'text',
          text: '我是',
          css: {
            left: '380rpx',
            top: '450rpx',
            fontSize: '24rpx',
            color: '#333333',
            align: 'center'
          },
        }
        ,
        {
          type: 'text',
          text: nickName,
          css: {
            left: '470rpx',
            top: '450rpx',
            fontSize: '24rpx',
            color: '#DC0201',
            align: 'center'
          },
        }
      ]
    })
  },

  onImgOK(e) {
    this.setData({
      shareImage: e.detail.path
    })
    wx.hideLoading()
  },

  handleCancelPoster() {
    this.setData({
      showModal: false
    })
  },

  handleSavePoster() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showModal: false
        })
      }
    })
  },

  innitQRcode(token) {
    var that = this
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
        var tel = encodeURIComponent(userInfo.mobile)
        wx.request({
          url: getApp().apiUrl + "/api/weixin/qrCode",
          method: 'post',
          data: {
            scene: tel,
            page: "pages/index/index",
            is_hyaline: true
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          responseType: 'arraybuffer',
          success(res) {
            var src2 = wx.arrayBufferToBase64(res.data); //对数据进行转换操作
            that.setData({
              img: 'data:image/png;base64,' + src2
            })
          }
        })
      },
      fail: function (res) {

      }
    })
  },

})