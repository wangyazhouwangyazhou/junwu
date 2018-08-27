const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    pageend: false,
    list: []
  },

  onLoad(options) {
    // wx.showLoading({ title: '加载中...' })
    this._getNavScrollData()
  },

  onReachBottom() {
    if (this.data.pageend) return;

    this.setData({
      page: ++this.data.page,
    });
    this.onLoadMoreData()
  }, 

  _getNavScrollData(page = this.data.page) {
    const params = {
      page: this.data.page,
      type: 1
    }
    ajax.myFavorite(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        list,
        page: ++page ,
        noResult,
        noMoreData,
        total: res.data.total
      })
    })
  },

  wditemclick(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wd/wd-detail/wd-detail?id=' + id,
    })
  },

}))