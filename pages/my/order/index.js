const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    loading: true,
    tabCurrent: 0
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的预约'
    })
  },

  onShow() {
    this.setData({
      page: 1,
      list:[]
    });

    this._getScrollData()
  },

  onReachBottom() {
    this.onLoadMoreData()
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData(){
    const params = {
      page: this.data.page,
      type: this.data.tabCurrent
    }

    ajax.programMySubscribe(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        page: ++this.data.page,
        list,
        noResult,
        noMoreData,
      });      

      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  changeTab(event) {
    const tabCurrent = event.currentTarget.dataset.tabcurrent;

    this.setData({
      page: 1,
      list:[],
      tabCurrent:tabCurrent
    });

    this._getScrollData()
  },

  goToDetail(event) {
    const vid = event.currentTarget.dataset.vid;
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + vid
    })
  },

  

}))