const app = getApp();
const ajax = app.ajax;

Page({

  data: {
    page: 1,
    loadAllData: false,
    list: [],
  },

  onLoad(options) {
    wx.showLoading({title:'加载中...'})
    if (!options.type) {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    } else{
      this.types = app.types[this.options.type];
      this.pageSet();
      this._getData();
    }
  },

  pageSet() {
    let title = this.types.titleName
    if(this.options.act) {
      title = this.types.navName
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  _getData(){
    let params = {
      page: this.data.page,
    }
    if (this.options.act) {
      params = Object.assign(params,{act: this.options.act})
      ajax.myJoin(params).then(res=> {
        this._setListData(res)
      })
    } else {
      const fn = this.types['fn'];
      ajax[fn](params).then(res => {
        this._setListData(res)
      })
    }
  },

  _setListData(res) {
    let list = []
    let loadAllData = false;
    if (res.list && res.list.length > 0) {
      if (this.data.page > 1) {
        list = this.data.list.concat(res.list);
      } else {
        list = res.list
      }
      if (res.page * res.num >= res.total) {
        loadAllData = true;
      }
      setTimeout(() => {
        this.setData({
          page: ++this.data.page,
          list: this.formatData(list),
          loadAllData: loadAllData
        })
      }, 300)
    } else if(this.data.list.length === 0){
      this.setData({
        noResult: true
      })
    }
    wx.hideLoading()
  },

  formatData(data) {
    const list = []
    data.map(res => {
      const _obj = {
        id: res.pid || res.cid || res.lid || '',
        templateid: res.templateid,
        cover: res.cover,
        title: res.title,
        joinnum: res.joinnum,
        state: res.state || '',
      }
      list.push(_obj)
    })
    return list
  },

  onLoadMoreData() {
    if (this.data.loadAllData || this.$timer) return;
    this.$timer = setTimeout(() => {
      this._getData();
    },300)
  },

  selectBannerList(event) {
    const id = event.currentTarget.id;
    wx.navigateTo({
      url: `${this.types['detailUrl']}?id=${id}`
    })
  }
})