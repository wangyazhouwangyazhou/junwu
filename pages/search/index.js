const { ajax, util, common, app, share} = getApp()

Page(Object.assign({}, common, share, {
  data: {
    page: 1,
    maskHidden: true
  },

  onLoad(option) {
    this.util= util;
    var type = option.type;

    this.setData({
      type:type
    })

    wx.hideShareMenu();
  },

  onShow() {
    this.setData({
      page:1
    })
    //this._getScrollData();
  },

  onReachBottom() {
    this.onLoadMoreData();
  },

  _getScrollData(page) {
    const params = {
      page: this.data.page,
      keyword: this.data.keyword,
      type: this.data.type
    }
    ajax.getSearch(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        list,
        page: ++this.data.page
      })
    })
  },

  goToBack(event) {
    wx.navigateBack();
  },

  onTapTemplateItem(event) {
    const id = event.currentTarget.id;
    const url = `/pages/article/index?id=${id}`
    wx.navigateTo({
      url
    })
  },

  onTapTemplateItem2(event) {
    var url = "/"+event.currentTarget.dataset.link;
    wx.navigateTo({
      url
    })
  },

  goToDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

  searhContent(event) {
    const keyword = event.detail.value;
    this.setData({
      keyword:keyword,
      page:1
    })

    this._getScrollData(1);
  },

  playVideo(event) {
    const vid = event.currentTarget.dataset.vid;
    const id = event.currentTarget.id;
    const list = this.data.list;
    const offsetTop = event.currentTarget.offsetTop

    ajax.getVideoUpdate({vid});

    const videoUrl = list[id]['url'];

    this.setData({
      videoUrl:videoUrl,
      offsetTop: offsetTop
    })
  }

}))
