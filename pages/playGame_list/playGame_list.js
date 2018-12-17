// pages/playGame_list/playGame_list.js
var page=1
var app = getApp()
Page({
  data: {
    show:true,
    indicatorDots: true,
    autoplay: true,
    loadingHidden: false, // loading
    userInfo: {},
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: 0,
    loadingMoreHidden: true,
    searchInput: '',
    curPage: 1,
    pageSize: 10,
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
    console.log(this.data.activeCategoryId)
  },

  toDetailsTap: function (e) {
    console.log(e);
    wx.navigateTo({
      url: "/pages/courseDetail/courseDetail?businessactivityid=" + e.currentTarget.dataset.id+
        "&businessid=" + e.currentTarget.dataset.bid + "&activitytype=" + e.currentTarget.dataset.activitytype
    })
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
      wx.request({
        url: getApp().apiUrl +'/api/product/menu/list',
        method:"get",
        header:{
          'Authorization': tokenVal,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          var categories = [{ productMenuId: 0, name: "全部" }];
          if (res.data.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
            categories.push(res.data.list[i]);
            }
          }
          that.setData({
            categories: categories,
            activeCategoryId: 0,
          });
          that.getGoodsList(0);
          console.log(categories);
        }
      })
      }
      })
  },
  onPageScroll(e) {
    console.log(e);
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  getGoodsList: function (categoryId, append) {
    var that = this;
    var mdata = { 'productmenuid': categoryId, 'page': that.data.curPage, 'limit': that.data.pageSize, 'activityname': that.data.searchInput};
    if (categoryId==0) {
      mdata = {'page': that.data.curPage, 'limit':that.data.pageSize,'activityname':that.data.searchInput}
    }
    wx.showLoading({
      "mask": true
    })
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
      wx.request({
      url: getApp().apiUrl +'/api/product/list',
      method:"post",
        header: {
          'Authorization': tokenVal,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:mdata,
      success: function (res) {
        console.log(res);
        // console.log(res.data.page.pageSize);
        wx.hideLoading();
        if (res.data.code !==0) {
          let newData = { loadingMoreHidden: false }
          if (!append) {
            newData.goods = []
          }
          that.setData(newData);
          return
        }
        let goods = [];
        if (append) {
          goods = that.data.goods
        }
        for (var i = 0; i < res.data.page.list.length; i++) {
          goods.push(res.data.page.list[i]);
        }
        that.setData({
          loadingMoreHidden: true,
          goods: goods,
        });
      }
    })
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch: function (e) {
    var searchInput=e.detail.value;
    this.setData({
      curPage: 1,
      searchInput: searchInput
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage+1
    });
    console.log(this.data.curPage)
    this.getGoodsList(this.data.activeCategoryId, true);
  },
  searchEnd(e){
    console.log(e)
    this.setData({
      show: !this.data.show
    })
    this.getGoodsList(e.currentTarget.id);
  }
})
