const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, app.videoFn, app.shareFn, {

  data: {
    page: 1,
    share_view: false
  },

  onLoad(options) {
    var tit = options.tit
    this._getScrollData()
    wx.setNavigationBarTitle({
      title: tit
    })
  },

  onReachBottom() {
    this.onLoadMoreData()
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData() {
    const id = this.options.id

    let params = {
      page: this.data.page,
      specialId: id
    }

    ajax.getSpecialDetail(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      res.data.list = this.normalizeVideoData(res.data.list)
      const listdata = this.onNormalizeScrollData(res.data, this.data.list)
      const data = Object.assign(listdata, {
        banner: res.data.banner,
        content: res.data.content,
        page: ++this.data.page,
        total: res.data.total
      })
      this.setData(data)

      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 2000)
    })
  },

  palyVideoOnce(vid) {
    ajax.getVideoUpdate({ vid })
  },

  onTapTemplateItem(event) {
    const id = event.currentTarget.id
    const url = `/pages/article/index?id=${id}`
    wx.navigateTo({
      url
    })
  },

  pageTo(id) {
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

  onShareAppMessage() {
    var self = this;

    return {
      title: this.data.shareTitle || null,
      path: this.data.sharePath || 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
      complete: function () {
        self.setData({
          shareTitle: "",
          sharePath: ""
        });
      }
    }
  },

  playVideo(event) {
    const vid = event.currentTarget.dataset.vid;
    const id = event.currentTarget.id;
    const list = this.data.list;
    const offsetTop = event.currentTarget.offsetTop

    ajax.getVideoUpdate({ vid });

    const videoUrl = list[id]['url'];

    this.setData({
      videoUrl: videoUrl,
      offsetTop: offsetTop
    })
  },

  goToDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

  onTapTemplateItem(event) {
    const id = event.currentTarget.id;
    const url = `/pages/article/index?id=${id}`
    wx.navigateTo({
      url
    })
  },

  //点赞
  onTapPraise(event) {
    var eledata = event.currentTarget.dataset;
    const action = eledata.state == 0 ? 'add' : 'del';

    if (action == 'del') {
      wx.showToast({
        title: '您已点赞',
        image: '/images/icon-warn2.png',
        duration: 1200
      })
      return;//只能点赞，不能取消
    }

    var formId = event.detail.formId;
    const params = {
      articleId: eledata.id,
      action: action,
      formId: formId
    }

    ajax.getPraise(params).then(res => {
      //ok
      for (var i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].id == eledata.id) {
          this.data.list[i].is_praise = eledata.state == 0 ? 1 : 0;
          if (eledata.state == 0) {
            this.data.list[i].praise_count = this.data.list[i].praise_count + 1
          } else {
            this.data.list[i].praise_count = this.data.list[i].praise_count - 1
          }

        }
      }
      this.setData({
        list: this.data.list
      });

      wx.showToast({
        title: "已点赞",
        icon: 'success',
        duration: 1500
      })
    })
  },


  //收藏
  onTapMark(event) {
    var formId = event.detail.formId;
    var eledata = event.currentTarget.dataset;
    const action = eledata.state == 0 ? 'add' : 'del'
    const params = {
      articleId: eledata.id,
      action: action,
      formId: formId
    }

    ajax.getMark(params).then(res => {
      //ok
      for (var i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].id == eledata.id) {
          this.data.list[i].is_favorite = eledata.state == 0 ? 1 : 0;
        }
      }
      this.setData({
        list: this.data.list
      });

      wx.showToast({
        title: action == 'add' ? "已收藏" : "已取消收藏",
        icon: 'success',
        duration: 1500
      })
    })
  },

  //分享
  onTapShare(event) {
    var eledata = event.currentTarget.dataset;
    var id = eledata.id;
    var cover = eledata.cover;
    var title = eledata.title;
    var message = eledata.message;
    var duration = eledata.duration;
    this.setData({
      share_view: true,
      cover: cover,
      shareCover: cover,
      shareTitle: title,
      shareDesc: message,
      shareTime: duration,
      shareId: id,
      sharePath: 'pages/video/video-detail/index?id=' + id
    });
  },

}))