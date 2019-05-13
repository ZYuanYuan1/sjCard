// pages/index/index.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var config = require('../../utils/config.js');
var app = getApp();
var qqmapsdk;
var page = 1;
var hadLastPage = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    'jobtimetype': '2',
    'amount': '10',
    'wtiming': '2018-12-11  周六  12:12',
    'searchVal': '', //绑定搜索框的值
    'task': '', //任务
    'taskval': 0,
    'area': '', //区
    'areaval': 0,
    'sort': '',
    'sortval': 0,
    'homeList': [], //页面主列表
    'bannerList': [], //页面主列表
    'reachBottomTip': false,
    'locationStr': '加载中...', //定位地址
    'isfirst': '',
    'sysMessage': '最新消息 前1000名购卡会员得大礼包！',
    taskArray: [
      "全部任务", "疯狂体验课", "赏金任务", "赏物任务", "线上任务", "线下任务",
    ],
    areaArray: [
      "全城", "上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "其他"
    ],
    sortArray: [
      "综合排序", "价格从低到高", "价格从高到低", "最新发布", "距离最近"
    ],
    tasksSelectedIndex: 0,
    areasSelectedIndex: 0,
    sorsSelectedIndex: 0,
    taskSelectedIndex: 0,
    areaSelectedIndex: 0,
    sortSelectedIndex: 0,
    taskHiden: true,
    areaHiden: true,
    sortHiden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: config.key
    });
    //邀请的电话号码
    if (options.inviteUserPhone) {
      var inviteUserPhone = options.inviteUserPhone;
      getApp().globalData.invitePeopleNumber = inviteUserPhone;
    }
    var that = this;
    page = 1;
    hadLastPage = false;
    that.loadBannerListFun(); //banner数据加载。。。
    that.loadMessageFun(); //最新消息数据加载。。。
    // 地址数据加载。。。。。。
    if (options.location) {
      that.setData({
        'locationStr': options.location
      })
      that.locationFun();
    } else {
      that.locationFun();
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
  //选项卡方法
  filterTitlesSelectedAtIndex0: function (event) {
    var index = event.currentTarget.dataset.index
    if (this.data.tasksSelectedIndex !== index) {
      this.setData({
        taskHiden: false,
        areaHiden: true,
        sortHiden: true,
        tasksSelectedIndex: index,
      })
    } else {

      this.setData({
        taskHiden: !this.data.taskHiden,
        areaHiden: true,
        sortHiden: true,
      })
    }
  },
  filterTitlesSelectedAtIndex1: function (event) {
    // console.log(event)
    var index = event.currentTarget.dataset.index
    if (this.data.areasSelectedIndex !== index) {
      this.setData({
        taskHiden: true,
        areaHiden: false,
        sortHiden: true,
        areasSelectedIndex: index,
      })
    } else {

      this.setData({
        areaHiden: !this.data.areaHiden,
        taskHiden: true,
        sortHiden: true,
      })
    }
  },
  filterTitlesSelectedAtIndex2: function (event) {
    var index = event.currentTarget.dataset.index
    if (this.data.sortsSelectedIndex !== index) {
      this.setData({
        taskHiden: true,
        areaHiden: true,
        sortHiden: false,
        sortsSelectedIndex: index,
      })
    } else {
      this.setData({
        sortHiden: !this.data.sortHiden,
        taskHiden: true,
        areaHiden: true,
      })
    }
  },

  filterTitleSelectedAtIndex0: function (event) {
    var index = event.currentTarget.dataset.index
    if (this.data.taskSelectedIndex !== index) {
      this.setData({
        taskSelectedIndex: index,
        task: this.data.taskArray[index],
        taskval: index,
      })
      //调用搜索
      var that = this;
      page = 1;
      hadLastPage = false;
      this.setData({
        homeList: [],
        reachBottomTip: false,
        taskHiden: true
      }); //将数据清空
      this.loadScoreListFun(this.data.searchVal, this.data.taskval, this.data.areaval, this.data.sortval);
    }
    this.setData({
      filterDropDownListHiden: true
    })
  },
  filterTitleSelectedAtIndex1: function (event) {
    var index = event.currentTarget.dataset.index
    if (this.data.areaSelectedIndex !== index) {
      this.setData({
        areaSelectedIndex: index,
        area: this.data.areaArray[index],
        areaval: index,
      })
      //调用搜索
      var that = this;
      page = 1;
      hadLastPage = false;
      this.setData({
        homeList: [],
        reachBottomTip: false,
        areaHiden: true
      }); //将数据清空
      this.loadScoreListFun(this.data.searchVal, this.data.taskval, this.data.areaval, this.data.sortval);
    }
    this.setData({
      filterDropDownListHiden: true
    })
  },
  filterTitleSelectedAtIndex2: function (event) {
    var index = event.currentTarget.dataset.index
    if (this.data.sortSelectedIndex !== index) {
      this.setData({
        sortSelectedIndex: index,
        sort: this.data.sortArray[index],
        sortval: index
      })
      //调用搜索
      var that = this;
      page = 1;
      hadLastPage = false;
      this.setData({
        homeList: [],
        reachBottomTip: false,
        sortHiden: true
      }); //将数据清空
      this.loadScoreListFun(this.data.searchVal, this.data.taskval, this.data.areaval, this.data.sortval);
    }
    this.setData({
      filterDropDownListHiden: true
    })
  },

  //加载赚积分课程方法
  loadScoreListFun: function (searchVal, subtype, area, sort) {
    var that = this;
    if (hadLastPage != false) {
      that.setData({
        reachBottomTip: true
      });
      return;
    };
    wx.request({
      url: getApp().apiUrl + '/api/businessactivity/zshblist',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'limit': 10,
        'page': page,
        'status': 4,
        'activityname': searchVal,
        'subtype': subtype,
        'area': area,
        'sort': sort,
        'lat': app.globalData.latitude,
        'lng': app.globalData.longitude
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code == 0) {
          var homeList = that.data.homeList;
          // console.log(homeList[1].activitypic);
          wx.createCameraContext(this)
          var data = res.data.page.list;
          // console.log(data[0]);
          // data[0].activitypic ="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png"
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              homeList.push(data[i]);

            }
          }
          if (res.data.page.currPage == res.data.page.totalPage) {
            hadLastPage = res.data.page.currPage;
            that.setData({
              reachBottomTip: true
            });
          } else {
            page++;
          };
          for (var i = 0; i < homeList.length; i++) {
            if (homeList[i].shelftime != null && homeList[i].endtime != null) {
              homeList[i].shelftime = homeList[i].shelftime.substring(0, 16);
              homeList[i].endtime = homeList[i].endtime.substring(0, 16);
            }
            that.setData({
              'homeList': homeList
            });
          }
        };

      },

    })
  },
  //广告图方法
  loadBannerListFun: function () {
    var that = this;
    wx.request({
      url: getApp().apiUrl + '/api/banner/list',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'limit': 10,
        'page': page
      },
      success: function (res) {
        // console.log('123:' + res);
        if (res.data.code == 0) {
          var bannerList = [];
          var data = res.data.page.list;
          if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              bannerList.push(data[i]);
            }
          }
          that.setData({
            'bannerList': bannerList
          });
        };

      },

    })
  },
  //定位地址页面加载。。。。
  searchBarSelected: function (e) {
    // console.log(e);
    var loca = e.currentTarget.dataset.locaAdd
    // console.log(loca);
    wx.navigateTo({
      url: '/pages/search/search?loca=' + loca
    })
  },

  //input点击键盘的完成完成输入
  valDone: function (e) {
    // console.log(e);
    var currrVal = e.detail.value.trim();
    this.setData({
      'searchVal': currrVal
    });
    page = 1;
    hadLastPage = false;
    this.setData({
      homeList: [],
      reachBottomTip: false
    }); //将数据清空
    this.loadScoreListFun(currrVal, this.data.taskval, this.data.areaval, this.data.sortval);
  },
  //跳转到积分详情
  skip_coreDetail: function (e) {
    // console.log(e);
    var businessactivityid = e.currentTarget.dataset.businessId;
    var bid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/scoreDetail/scoreDetail?businessactivityid=' + businessactivityid + "&businessid=" + bid,
    })
  },
  //点击banner图进入详情页
  skip_bannerDetail: function (e) {
    // console.log(e);
    var bannerType = e.currentTarget.dataset.bannerType
    var bannerRequesturl = e.currentTarget.dataset.bannerRequesturl
    // console.log(bannerType);
    // console.log(bannerRequesturl);
    if (bannerType == 1) {
      wx.navigateTo({
        url: '/pages/scoreDetail/scoreDetail?businessactivityid=' + bannerRequesturl,
      })
    } else if (bannerType == 2) {
      wx.navigateTo({
        url: '/pages/playDetail/playDetail?businessactivityid=' + bannerRequesturl,
      })
    } else if (bannerType == 3) {
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?businessactivityid=' + bannerRequesturl,
      })
    } else if (bannerType == 4) {
      wx.navigateTo({
        url: '/pages/lessonList/lessonList?businessId=' + bannerRequesturl,
      })
    }

  },
  //上拉刷新，下拉加载
  onReachBottom: function () {
    //var county = this.data.county;
    var that = this;
    var searchVal = that.data.searchVal;
    this.loadScoreListFun(this.data.searchVal, this.data.taskval, this.data.areaval, this.data.sortval); //加载列表
  },
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    this.setData({
      homeList: [],
      'reachBottomTip': false
    }); //将数据清空
    this.loadScoreListFun(this.data.searchVal, this.data.taskval, this.data.areaval, this.data.sortval);
    wx.stopPullDownRefresh();
  },
  //图片出现错误时调用
  errImg: function (e) {
    // console.log(e);
    //util.errImgFun(e, this);
    var _errImg = e.target.dataset.errImg;
    var _errObj = {};
    _errObj[_errImg] = "/images/home_default_img.png";
    // console.log(e.detail.errMsg + "----" + "----" + _errImg);
    this.setData(_errObj);
  },
  //初始化页面
  loadMessageFun: function () {
    var that = this;
    wx.request({
      url: getApp().apiUrl + '/api/message/syslist',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'limit': 1,
        'page': page
      },
      success: function (res) {
        // console.log('======' + res);
        if (res.data.code == 0) {
          var data = res.data.page.list;
          // console.log(data)
          if (data && data.length > 0) {
            that.setData({
              'sysMessage': data[0].message
            });
          }
          //that.setData({ 'homeList': homeList });
        };

      },

    })
  },
  //定位地址方法
  locationFun() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            // console.log('=====' + res);
            var add = res.result.address;
            if (res.result.address_reference && res.result.address_reference.landmark_l1) {
              that.setData({
                'locationStr': res.result.address_reference.landmark_l1.title
              })
            } else if (res.result.address_reference && res.result.address_reference.landmark_l2) {
              that.setData({
                'locationStr': res.result.address_reference.landmark_l2.title
              })
            } else {
              that.setData({
                'locationStr': add
              })
            }
          },
          fail: function (res) {
            // console.log(res);
          },
          complete: function (res) {
            // console.log(22);

          }
        });

      },
      fail: function (res) {
        // console.log(res);
        // console.log('定位失败');
        that.setData({
          'locationStr': '定位失败'
        })
      },
      complete: function (res) {
        // console.log(11);
        that.loadScoreListFun('', that.data.taskval, that.data.areaval, that.data.sortval);
      }
    })
  }
})