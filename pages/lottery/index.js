const app = getApp();
const ajax = app.ajax;

Page({

  data: {
    styles: {
      mainColor: "#fae800"
    },
    list: [
      {state:0},
      {state:0},
      {state:0},
      {state:0},
      {state:0},
      {state:0}
    ],
    info: '',
    prizeList: [],
    isChecked: false,
    result: null,
    prizeMsg: ''
  },

  onLoad(options) {
    wx.showLoading({title:'加载中...'})
    const lid = this.options.id;
    ajax.lotteryData({lid}).then(res => {
      if (res.pageSet) app.pageSet(res.pageSet);
      wx.setNavigationBarTitle({
        title: res.info.title
      })
      this.setData({
        info: res.info,
        prizeList: res.prizeList
      })
      wx.hideToast()
    })
  },

  onTapLottery(event) {
    if (!this.data.isChecked) {
      const index = event.currentTarget.id;
      const list = this.data.list;
      list[index].state = 1
      this.setData({
        list,
        isChecked: true
      });
      list[index].state = 0;
      this.activeList = list;
      this.getResult();
      setTimeout(() => {
        this.setResult();
      }, 1200)
    }
  },

  getResult(list) {
    const params = {
      lid: this.options.id
    }
    ajax.lotteryPrize(params).then(res => {
      this.prize = res;
      this.setResult()
    })
  },

  setResult() {
    if (this.lotteryResult) {
      this.lotteryResult = false;
      let result = null;
      let prizeMsg = '';
      if (this.prize.error) {
        wx.showModal({
          title: '提示',
          content: this.prize.error,
          showCancel: false
        })
      } else if(this.prize.isprize && this.prize.isprize.pid){
        result = true;
        prizeMsg = this.prize.isprize.title
      } else {
        result = false;
      }
      this.setData({
        result,
        prizeMsg,
        isChecked: false,
        list: this.activeList,
      });
    } else {
      this.lotteryResult = true
    }
  },

  onCloseModelTemplate(event) {
    this.setData({
      result: null,
      prizeMsg: '',
    })
  },

  onViewDetailTemplate() {
    wx.navigateTo({
      url: '/pages/user/mylottery/index'
    })
  }

})