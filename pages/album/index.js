const app = getApp()
const ajax = app.ajax
const util = app.util
// pages/album/index.js
Page(Object.assign({}, app.common, app.shareArticleFn, {

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    id: '',
    list: [],
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      id:id
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
    this._getScrollData()

  },

  _getScrollData: function () {
    let params = {
      page: this.data.page,
      specialId: this.data.id
    }
    ajax.programDetail(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        total: res.data.total,
        page: ++this.data.page,
        list,
        noResult,
        noMoreData,
        title: res.data.title
      })
      wx.setNavigationBarTitle({
        title: this.data.title
      })
    })

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
    this.onLoadMoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))