const app = getApp();
const ajax = app.ajax;
// pages/my/my.js
Page(Object.assign({}, {

  /**
   * 页面的初始数据
   */
  data: {
    tab: '',
    flag: false,
    zan: false,
    ping: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      tab: id
    })
  },

  onShow() {
    this.getMsgFlag(); 
  },

  //
  getMsgFlag: function () {
    var params = {
    }
    ajax.unreadToast(params).then(res => {
      var zan = res.data.praiseToast == 1 ? true : false;
      var ping = res.data.commentToast == 1 ? true: false;
      this.setData({
        zan: zan,
        ping: ping
      });
      wx.hideToast()
    })
  },

  //收藏的视频
  myVedioClick: function () {
    wx.navigateTo({
      url: '/pages/my/marklist/index'
    })
  },

  //收藏的问答
  myWDClick: function () {
    wx.navigateTo({
      url: '/pages/my/mywd/mywd'
    })
  },

  //收到的赞
  myZanClick: function () {
    wx.navigateTo({
      url: '/pages/my/myzan/myzan?id=1'
    })
  },

  //收到的评论
  myPLClick: function () {
    wx.navigateTo({
      url: '/pages/my/myzan/myzan?id=2'
    })
  },

  // 文章收藏
  myArticleClick: function() {
    wx.navigateTo({
      url: '/pages/my/article/index'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

}))