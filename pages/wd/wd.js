const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    pageend: false,
    list:[]
  },

  onLoad(options) {
    this._getScrollData()
  },

  onReachBottom() {
    if (this.data.pageend) return;

    this.setData({
      page: ++this.data.page,
    });
    this._getScrollData()
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData() {
    let params = {
      page: this.data.page,
    }

    ajax.getWDList(params).then(res => {
      var pageend = res.data.list.length == 0;
      res.data.list = this.data.list.concat(res.data.list);
      var data = Object.assign(res.data, {
        pageend: pageend
      })
      this.setData(data)
      
      setTimeout(() => {
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  gotoQuestion() {
    wx.navigateTo({
      url: '/pages/wd/question',
    })
  },

  wditemclick(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wd/wd-detail/wd-detail?id=' + id,
    })
  },

}))