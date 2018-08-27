const app = getApp();
const ajax = app.ajax;

Page({

  data: {
    page: 1,
    noResult: false,
    loadingAllData: false,
    list: []
  },

  onLoad(options) {
    wx.showLoading({title:'加载中...'})
  },

  onShow() {
    this.setData({
      page: 1,
    })
    this._getData()
  },

  _getData() {
    const params = {
      page: this.data.page
    }
    ajax.myLottery(params).then(res => {
      if (res.list.length) {
        let list = []
        let loadAllData = false;
        if (this.data.page > 1) {
          list = this.data.list.concat(res.list);
        } else {
          list = res.list
        }
        if (res.page * res.num >= res.total) {
          loadAllData = true;
        }
        this.setData({
          page: ++this.data.page,
          list,
          loadAllData,
        })
      } else if(this.data.list.length === 0){
        wx.setStorageSync('prizeData', [])
        this.setData({
          noResult: true
        })
      }
      wx.hideToast();
    })
  },

  onLoadMoreData() {
    if (this.data.loadAllData || this.$timer) return;
    this.$timer = setTimeout(() => {
      this._getData();
    },300)
  },

  getPrize(event) {
    const index = event.currentTarget.id;
    const sortId = event.currentTarget.dataset.sort;
    if (sortId === 0) {
      wx.setStorageSync('prizeData', new Array(this.data.list[index]))
      wx.navigateTo({
        url: "/pages/user/mylottery/getprize/index"
      })
    } else if (sortId === 1) {
      // wx.setStorageSync('prizeData', new Array(this.data.list[index]))
      // wx.navigateTo({
      //   url: "/pages/user/pay/index"
      // })
    } else if (sortId === 2) {

    }
  },

})