const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl;
// pages/my/my.js
Page(Object.assign({}, app.common, app.videoFn, app.shareFn, {
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: []
  },
  todetail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/article/index?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getNavScrollData()
  },

  _getNavScrollData(page = this.data.page, type = this.data.type) {
    const params = {
      page: this.data.page,
      type: 2
    }
    ajax.usermyFavorite(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        list: res.data.list,
        total: res.data.total,
        page: ++page,
        noResult,
        noMoreData,
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