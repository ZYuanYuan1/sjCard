// pages/address_add/address_add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  addAddr(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  editAddess: function (e) {
    var addressList = JSON.stringify(e.currentTarget.dataset.addresslist);
    console.log(addressList);
    wx.navigateTo({
      url: "/pages/address/address?addressList=" + addressList 
    })
  },
  //地址数据初始化
   innitShoppingAddr(){
     var that = this;
     wx.getStorage({
       key: 'loginStutes',
       success: function (res) {
         console.log(res);
         var userInfo = JSON.parse(res.data);
         var tokenVal = userInfo.app_token;
     wx.request({
       url: getApp().apiUrl +'/api/userAddr/list',
       header: {
         'Authorization': tokenVal,
         'content-type':'application/x-www-form-urlencoded'  
       },
       method:"get",
       success(res){
         console.log(res);
         if (res.data.code == 0 && res.data.list.length!=0) {
           that.setData({
             addressList: res.data.list
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
  deleteAddress: function (e) {
    var that = this;
    var id = JSON.parse(e.currentTarget.dataset.id);
    wx.getStorage({
      key: 'loginStutes',
      success: function (res) {
        console.log(res);
        var userInfo = JSON.parse(res.data);
        var tokenVal = userInfo.app_token;
    wx.showModal({
      title: '提示',
      content: '确定要删除地址吗？',
      success: function (res) {
        console.log(tokenVal);
        if (res.confirm) {
          wx.request({
            url: getApp().apiUrl + '/api/userAddr/delete/' + id,
            method: "get",
            data: {
              id: id
            },
            header:{
              'Authorization': tokenVal,
              'content-type': 'application/x-www-form-urlencoded' 
            },
            success: (res) => {
               console.log(res);
              if(res.data.code==0){
                that.innitShoppingAddr()
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },

    })
      }
    })
  }
})