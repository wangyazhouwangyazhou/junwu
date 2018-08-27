const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl;
// pages/user/admin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    icon: 'info',
    msg: '你确认要登录管理后台吗？',
    button: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '提示信息'
    });

    const params = {
      code: this.options.code,
      app_id: apiUrl.appId
    }
    ajax.userQrcodeLoginCheck(params).then(res => {
      this.setData({
        loading: false,
        icon: res.icon,
        msg: res.msg,
        button: res.button
      })
    })
  },

  confirmLogin() {
    const userSession = wx.getStorageSync('userSession');
    const params = {
      code: this.options.code,
      app_id: apiUrl.appId
    }
    ajax.userQrcodeLoginConfirm(params).then(res => {
      this.setData({
        icon: res.icon,
        msg: res.msg,
        button: res.button
      })
    })

  },
})