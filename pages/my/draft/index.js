const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl;

Page(Object.assign({}, app.common, app.shareWDFn, {

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
    var myDate = new Date()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    list: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this._getScrollData()
  },

  goToDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/wd/answer/index?qid=' + id + '&type=1',
    })
  },

  _getScrollData() {
    let params = {
      page: this.data.page,
    }
    ajax.answerDraftList(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        page: ++this.data.page,
        list: list,
        noResult,
        noMoreData,
      });

      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }, 2000)
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
    this._getScrollData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))