const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    tabCurrent: 0
  },

  onLoad(options) {
     wx.setNavigationBarTitle({
      title: '专题汇总'
    })
  },

  onShow() {
    this._getScrollData()
  },

  onReachBottom() {
    this.onLoadMoreData()
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData(page) {
    let params = {
      page: this.data.page,
    }

    ajax.getSpecialIndex(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)

      this.setData({
        list,
        page: ++this.data.page,
      })

      setTimeout(() => {
        wx.stopPullDownRefresh();
      },3000)
    })
  },

  goToDetail(event) {
    const id = event.currentTarget.dataset.id;
    const types = event.currentTarget.dataset.type;
    const tit = event.currentTarget.dataset.tit;
    if(types == 1) {
      wx.navigateTo({
        url: '/pages/topic/topic-list/index?id=' + id + '&tit=' + tit,
      })
    } else {
      wx.navigateTo({
        url: '/pages/album/index?id=' + id + '&tit=' + tit,
      })
    }
  },

}))