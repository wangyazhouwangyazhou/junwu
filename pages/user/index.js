const app = getApp()
const util = app.util;

Page({

  data: {
    loading: true,
    types: app.types,
    userInfo: ''
  },

  onLoad(options) {
    wx.showLoading({
      title: '加载中...'
    })
    util.getUserInfo().then(res => {
      this.setData({
        loading: false,
        userInfo: res.userInfo
      })
      wx.hideToast()
    });
  },

  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        let result = res.result;
        result = result.replace('http://', '');
        const action = result.split(':');
        const url = '../' + action[0] + '/' + action[1] + '?code=' + action[2];
        wx.navigateTo({
          url: url
        })
      }
    })
  }

})