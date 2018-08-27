const { ajax, util, common, apiUrl } = getApp()
// pages/reply/replyList.js
Page(Object.assign({}, common,{

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    comment: {},
    aid : '',
    list: [],
    cid : '',
    id: ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var aid = options.aid
    this.setData({
      id: id,
      aid:aid
    })
    // const params = {
    //   commentId : id,
    //   page: this.data.page
    // }
    // ajax.commentDetail(params).then(res => {
    //   this.setData({
    //     comment: res.data.comment,
    //     list:res.data.list,
    //     aid : aid,
    //     id: id
    //   })
    // })
  },

  previewImage(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  _getScrollData() {
    var plfrom =  wx.getStorageSync('plfrom')
    let params = {
      commentId: this.data.id,
      page: this.data.page,
      from: plfrom
    }

    ajax.commentDetail(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        comment: res.data.comment,
        page: ++this.data.page,
        list: list,
        digestList: res.data.digestlist,
        noResult,
        noMoreData,
        aid: res.data.article_id
      });

      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }, 2000)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  commentPraise(event) {
    var that = this;

    const type = event.currentTarget.dataset.type;
    const id = event.currentTarget.id;

    if (type == 'digest') {
      var toplist = this.data.comment
      if (toplist.is_praise == 1) {
        wx.showToast({
          title: '您已点赞',
          icon: 'error',
          duration: 1200
        })
        return;//只能点赞，不能取消
      }
      const params = {
        commentId: toplist.id,
        type: 2
      }
      ajax.commentPraise(params).then(res => {
        // if (toplist.id == this.data.id) {
          toplist.is_praise = 1;
          toplist.praise_count = parseInt(toplist.praise_count) + 1
            that.setData({
              comment: toplist
            })
          // }


        // wx.showToast({
        //   title: "已点赞",
        //   icon: 'success',
        //   duration: 1200
        // })
      })
      
    } else {
      var list = this.data.list
      if (list[id].is_praise == 1) {
        wx.showToast({
          title: '您已点赞',
          icon: 'error',
          duration: 1200
        })
        return;//只能点赞，不能取消
      }
      var commentId = list[id].id
      const params = {
        commentId: commentId,
        type: 2
      }
      ajax.commentPraise(params).then(res => {
        if (commentId == this.data.list[id].id) {
          list[id].is_praise = 1;
          list[id].praise_count = parseInt(list[id].praise_count) + 1
          that.setData({
            list: list
          })
        }
        wx.showToast({
          title: "已点赞",
          icon: 'success',
          duration: 1200
        })
      })
    }
  },

  replyxx (e) {
    var id = e.currentTarget.dataset.id;
    var aid = e.currentTarget.dataset.aid;
    var replay = e.currentTarget.dataset.replay;
    var pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pages/reply/index?id=' + id + '&type=1' + '&aid=' + aid + '&replay=' + replay + '&pid=' + pid,
    })
  },
  
  replyBoss (e) {
    var id = e.currentTarget.dataset.id
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: '/pages/reply/index?id=' + id + '&type=3' + '&aid=' + aid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this._getScrollData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.onLoadMoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))