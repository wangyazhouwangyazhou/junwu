const app = getApp()
const ajax = app.ajax
const util = app.util

Page(Object.assign({}, app.common, app.shareArticleFn, {
  data: {
    detail: {},
    collect: null,
    userSession: '',
    share_view: false,
    id : '',
    img: '',
    imglist: [],
    is_show: '',
    user: '',
    showImg: false
  },

  onLoad(options) {
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    var moblie = wx.getStorageSync('moblie');
    var isIphoneX = moblie['model'].indexOf('iPhone X') == 0 ? true : false;
    var is_show = options.is_show
    var windowWidth = moblie.windowWidth
    var windowHeight = moblie.windowHeight
    var screenHeight = moblie.screenHeight
    this.setData({
      isIphoneX: isIphoneX,
      id:options.id,
      is_show: is_show,
      is_login: is_login,
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      screenHeight: screenHeight
    })
    wx.showLoading({title: '加载中...'})
    this._getData()
  },

  scroll : function (e) {
    var that = this
    var scrollTop = e.detail.scrollTop
    that.setData({
      scrollTop: scrollTop
    })
    var is_tipe = wx.getStorageSync('is_tipe')
    if (scrollTop > this.data.windowHeight && scrollTop < 800 && !is_tipe) {
      wx.setStorageSync('is_tipe', 1)
      that.setData({
        showImg: true
      })
      setTimeout(function() {
        that.setData({
          showImg: false
        })
      }, 5000)
    }
  }, 

  getuser(event) {
    var type = event.currentTarget.dataset.type
    var errMsg = event.detail.errMsg
    var that = this;
    if (errMsg == 'getUserInfo:fail auth deny') {
      
    } else {
      wx.login({
        success: function (res) {
          let params = {
            // appId: '',
            code: res.code,
            iv: event.detail.iv,
            encryptedData: event.detail.encryptedData
          }
          ajax.userLogin(params, true).then(res => {
            var add = wx.getStorageSync('add')
            wx.setStorageSync('userSession', res.data.userSession);
            wx.setStorageSync('userInfo', res.data.userInfo)
            if (type == 2) {
              that.onTapShare(event)
            } else if (type == 1) {
              that.onTapMark(event)
            } else if (type == 3) {
              that.pageToReply(event)
            } else if (type == 4) {
              that.commentPraise(event)
            } else if (type == 5) {
              that.reply(event)
            } else if (type == 6) {
              that.onTapPraise(event)
            } else if (type == 7) {
              that.viewAllComment()
            }
          })
        }
      })
    }
  },
  onShow() {

  },
  onHide(){

  },
  
  onUnload () {
    wx.removeStorageSync('is_tipe')
  },

  previewImage(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
    })
  },


  reply (e) {
    var replyname = e.currentTarget.dataset.replyname
    var id = e.currentTarget.dataset.id
    var aid = e.currentTarget.dataset.aid
    // if(this.data.user == '' ) {
    //   var id = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/article/index?id=' + id)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      wx.navigateTo({
        url: '/pages/reply/replyList?id=' + id + '&aid=' + aid,
      })
    // }
  },

  _getData() {
    var argId = this.options.id;
    if (!argId){
      //没有的话从options.scene获取，此为获取小程序码B类接口的传参方式
      argId = decodeURIComponent(this.options.scene);
    }
    const params = {
      articleId: argId
    }
    const userSession = wx.getStorageSync('userSession')
    ajax.getArticleDetail(params).then(res => {
      if (res.data) {
        this.setData({
          userSession,
          detail: res.data,
          relatelist: res.data.relatelist,
          commentCount: res.data.comment_count,
          resource_type: 2,
          digestList: res.data.digest_comment,
          totalList: res.data.total_comment,
          commentCount: res.data.comment_count,
          id: res.data.id,
          cover: res.data.cover,
          title: res.data.sort,
          praise_count: res.data.praise_count,
          shareTitle: res.data.title,
          shareDesc: res.data.share_desc,
          shareCover: res.data.cover,
          shareId: res.data.id || res.data.vid,
          is_praise: +res.data.is_praise,
          is_favorite: +res.data.is_favorite,
          praiseCount: +res.data.praise_count || 0,
          id: res.data.id,
          tag_relatelist: res.data.tag_relatelist,
          share_record: res.data.share_record
        })
        var cov = res.data.total_comment
        var imglist = new Array()
        for (var i of cov) {
          if (i.cover == '') {
          } else {
            var width = i.image_info.width
            var height = i.image_info.height
            var cov = i.cover
            var original_cover = i.original_cover
            // const cover = JSON.parse(cov)

            imglist.push({ id: i.id, url: cov, height: height, width: width, original_cover: original_cover })
            this.setData({
              imglist: imglist,
            })
          }
        }
      } else {
        this.setData({
          detail: null,
        })
      }
      wx.hideLoading()
    })
  },
//点赞
  onTapPraise(event) {
    // if (this.data.user == '') {
    //   var id = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/article/index?id=' + id)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // }else {
      if (this.data.is_praise) {
        wx.showToast({
          title: "您已点赞过",
          icon: 'success',
          duration: 1200
        })
        return;//只能点赞，不能取消
      }

      if (this.timer) return;
      var formId = event.detail.formId;
      this.timer = true
      const is_praise = !this.data.is_praise
      const praise_count = is_praise ? ++this.data.praiseCount : --this.data.praiseCount
      const action = is_praise ? 'add' : 'del'
      const params = {
        articleId: this.options.id,
        action: action,
        formId: formId
      }
      ajax.getPraise(params).then(res => {
        this.setData({
          is_praise,
          praise_count
        })
        this.timer = false

        wx.showToast({
          title: "已点赞",
          icon: 'success',
          duration: 1200
        })
      })
    // }
  },
//收藏
  onTapMark(event) {

    // if (this.data.user == '') {
    //   var id = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function() {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/article/index?id=' + id)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   },1000)
    // } else {
      if (this.timer) return;
      var formId = event.detail.formId;
      this.timer = true
      const is_favorite = !this.data.is_favorite
      const action = is_favorite ? 'add' : 'del'
      const params = {
        articleId: this.options.id,
        action: action,
        formId: formId,
        type: 2
      }
      ajax.apifavorite(params).then(res => {
        this.setData({
          is_favorite
        })
        this.timer = false

        wx.showToast({
          title: action == 'add' ? "已收藏" : "已取消收藏",
          icon: 'success',
          duration: 1500
        })
      })
    // }
  },

  commentPraise(event) {
      var that = this;
      var list = {};

      const type = event.currentTarget.dataset.type;
      const id = event.currentTarget.id;

      if (type == 'digest') {
        list = this.data.digestList
      } else {
        list = this.data.totalList
      }
      if (list[id].is_praise == 1) {
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

        if (type == 'digest') {
          that.setData({
            digestList: list
          })
        } else {
          that.setData({
            totalList: list
          })
        }

        wx.showToast({
          title: "已点赞",
          icon: 'success',
          duration: 1200
        })
      })
    // }
  },

  onTapVideoDetail(event) {
    const id = event.currentTarget.id
    const url = `/pages/article/index?id=${id}`
    wx.redirectTo({
      url
    })
  },

  onTapShare(event) {
    var id = event.currentTarget.dataset.id
    // if (this.data.user == '') {
    //   var id = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/article/index?id=' + this.data.id)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      var id = this.data.id
      wx.navigateTo({
        url: `/pages/share/index?id=${id}&type=1`,
      })
      let params = {
        resourceId: this.data.shareId,
        type: 3
      }

      ajax.shareUpdate(params).then(res => { })
    // }
    // this.setData({
    //   share_view: true
    // });
  },

  pageToReply(event) {
    // if (this.data.user == '') {
    //   var id = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/article/index?id=' + id)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      wx.navigateTo({
        url: '/pages/reply/index?id=' + this.data.id + '&type=' + this.data.resource_type
      })
    // }
  },

  gotohome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  viewAllComment() {
    wx.navigateTo({
      url: '/pages/reply/all?id=' + this.data.id
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.shareTitle || null,
      path: this.data.sharePath || `${this.route}?id=${this.options.id}`,
      success: function(res) {

      },
      fail: function(res) {
        // 转发失败
      }
    }
  }

}))