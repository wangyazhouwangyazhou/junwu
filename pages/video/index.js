const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, app.videoFn, {

  data: {
    page: 1,
  },

  onLoad(options) {
    wx.showLoading({title: '加载中...'})
    this._getScrollData()
  },

  onReachBottom() {
    this.onLoadMoreData()
  },

  _getScrollData() {
    const id = this.options.id
    let params = {
      page: this.data.page
    }
    if (id) {
      params = Object.assign({}, params, {
        sortid: id,
      })
    }
    ajax.getVideoList(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      res.list = this.normalizeVideoData(res.list)
      const listdata = this.onNormalizeScrollData(res, this.data.list, 'vid')
      const data = Object.assign(listdata, {
        page: ++this.data.page,
      })
      this.setData(data)
      wx.hideLoading()
    })
  },

  palyVideoOnce(vid) {
    ajax.getVideoUpdate({vid})
  },

  pageTo(id) {
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

}))