const {ajax, util, common, apiUrl} = getApp()

Page(Object.assign({}, common, {

  data: {
    page: 1,
    list:[],
  },

  onLoad(options) {
    const id = options.id;
    const type = options.type;
    this.setData({
      id: id
    });
  },
  previewImage(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  reply(e) {
    var replyname = e.currentTarget.dataset.replyname
    var id = e.currentTarget.dataset.id
    var aid = e.currentTarget.dataset.aid

    wx.navigateTo({
      url: '/pages/reply/replyList?id=' + id + '&aid=' + aid,
    })
  },

  onShow() {
    this._getScrollData()
  },

  onReachBottom() {
    this.onLoadMoreReplyData();
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData() {
    let params = {
      page: this.data.page,
      articleId: this.data.id
    }

    ajax.allComment(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        page: ++this.data.page,
        list: list,
        digestList: res.data.digestlist,
        noResult,
        noMoreData,
      });
      
      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  commentPraise(event) {
    var that = this;
    var list = {};

    const type = event.currentTarget.dataset.type;
    const id = event.currentTarget.id;

    if(type == 'digest') {
      list = this.data.digestList
    } else {
      list = this.data.list
    }

    if(list[id]['is_praise'] == 1) {
      wx.showToast({
        title: '您已点赞',
        icon: 'error',
        duration: 1200
      })
      return;//只能点赞，不能取消
    }

    const cid = list[id]['id'];

    const params = {
      commentId: cid
    }
    ajax.commentPraise(params).then(res => {

      for (var i = 0; i < list.length; i++) {
        if (list[i].id == cid) {
          list[i].is_praise = 1;
          list[i].praise_count = parseInt(list[i].praise_count) + 1
        }
      }

      if(type == 'diget') {
        that.setData({
          digestList:list
        })
      } else {
        that.setData({
          list:list
        })
      }

      wx.showToast({
        title: "已点赞",
        icon: 'success',
        duration: 1200
      })
    })
  },

  onLoadMoreReplyData() {
    this._getScrollData()
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = ''
    }, 200)
  },

}))