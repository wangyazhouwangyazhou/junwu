const { ajax, util, common, apiUrl } = getApp()
// pages/my/phone/index.js
Page(Object.assign({}, common, {

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    phone: '',
    code: '',
    bangding: false,
    xiugai: false,
    codeDis: true,
    phoneCode :'发送验证码',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('userInfo')
    this.setData({
      username: value.username,
      avatar: value.avatar,
      iphone: value.phone
    })
    if (value.phone == '') {
      this.setData({
        bangding: true
      })
    } else {
      this.setData({
        xiugai: true
      })
    }
  },
  
  bindButtonTap(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  code () {

    if(this.data.phone.length == 11) {
      this.setData({
        disabled: true
      })
      var params = {
        phone: this.data.phone,
      }
      ajax.sendCode(params).then(res => {
      })
      this.setData({
        phoneCode: 60 
      })
      let time = setInterval(() => {
        let phoneCode = this.data.phoneCode
        phoneCode-- 
        this.setData({
          phoneCode: phoneCode
        })
        if (phoneCode == 0) {
          clearInterval(time)
          this.setData({
            phoneCode: "获取验证码",
            disabled:false
          })
        }
      }, 1000)
    } else {
      wx.showModal({
        title: '提示',
        content	: "请输入有效的手机号码"
      })
    }
  },

  getcode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  ok() {
    var params = {
      phone: this.data.phone,
      code: this.data.code
    }
    ajax.bindPhone(params).then(res => {
      wx.setStorageSync('userInfo', res.data.userInfo)
      var iphone = res.data.userInfo.phone
      this.setData({
        iphone: iphone,
        xiugai: true,
        bangding: false
      })
      wx.showModal({
        title: '提示',
        content: '绑定成功',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      
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
  onShareAppMessage: function () {
  
  }
}))