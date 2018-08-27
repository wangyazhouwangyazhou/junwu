const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl

Page(Object.assign({}, app.common, app.videoFn, app.shareFn, {
  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '军武PK赛'
    })
  },

  _getNavScrollData() {
    const params = {
      page: this.data.page,
    }
    ajax.pklists(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res, this.data.list)
      this.setData({
        list,
        page: ++this.data.page,
        noResult,
        noMoreData,
      })
    })
  },

  getuser(event) {
    var type = event.currentTarget.dataset.type
    var errMsg = event.detail.errMsg
    var that = this;
    if (errMsg == 'getUserInfo:fail auth deny') {

    } else {
      wx.login({
        success: function (res) {
          let params = {
            // appId: '',
            code: res.code,
            iv: event.detail.iv,
            encryptedData: event.detail.encryptedData
          }
          ajax.userLogin(params, true).then(res => {
            var add = wx.getStorageSync('add')
            wx.setStorageSync('userSession', res.data.userSession);
            wx.setStorageSync('userInfo', res.data.userInfo)
            that.setData({
              is_login: true
            })
            that._getNavScrollData()
          })
        }
      })
    }
  },

  goToPkDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pk/detail?id=' + id,
    })
  },

  support: function (e) {

    var id = e.currentTarget.dataset.id
    var optionid = e.currentTarget.dataset.optionid
    var index = e.currentTarget.dataset.index
    var params = {
      id: id,
      optionid: optionid
    }
    ajax.pksubmit(params).then(res => {
      this.setData({
        support: optionid,
        page: 1
      })
      this._getNavScrollData()
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
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    this.setData({
      is_login: is_login,
      page: 1
    })
    this._getNavScrollData()
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
    this._getNavScrollData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getNavScrollData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))