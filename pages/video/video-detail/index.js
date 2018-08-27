 const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl

Page(Object.assign({}, app.common, app.videoFn, app.shareFn,{

  data: {
    page: 1,
    is_share: 1, //是否展示分享图标
    share_view: false,
    maskHidden: true, //分享面板是否开启
    hiddenVideoShow: true,
    autoplay: false,
    isReply: false,
    isShow: false,
    textareaFocus: false,
    disabled: false,
    uploadimgs: '',
    id : '', 
    is_login: '',
    showImg:false
  },

  onShow() {

  },

  pause: function () {
    var that = this
    that.setData({
      showImg: true
    })
    setTimeout(function () {
      that.setData({
        showImg: false
      })
    }, 5000)
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
              that.viewAllComment(event)
            }
          })
        }
      })
    }
  },
  previewImage(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  hideForm() {
    this.setData({
      isReply: false,
      isShow: false,
    })
  },

  removeupload(e) {
    var index = e.currentTarget.dataset.index;

    this.setData({
      uploadimgs: ''
    });
  },
  reply(e) {

    var replyname = e.currentTarget.dataset.replyname
    var id = e.currentTarget.dataset.id
    var aid = e.currentTarget.dataset.aid
    // if (this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
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

  uploadPicture: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        var tempFilePaths = res.tempFilePaths
        // for (var i = 0; i < tempFilePaths.length; i++) {
        wx.uploadFile({
          url: apiUrl.upload,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            appId: apiUrl.appId,
          },

          success: _res => {
            let file = JSON.parse(_res.data);
            self.setData({
              uploadimgs: file.data.url
            });
            wx.hideLoading()
          },
        })
        // }
      }
    })
  }, 

  onLoad(options) {
    var id = options.id
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    var moblie = wx.getStorageSync('moblie');
    var isIphoneX = moblie['model'].indexOf('iPhone X') == 0 ? true : false;
    var screenHeight = moblie.screenHeight
    this.setData({
      isIphoneX: isIphoneX,
      user: userInfo,
      id: id,
      is_login: is_login,
      screenHeight: screenHeight
    })
    wx.showLoading({title: '加载中...'})
    this._getScrollData()
  },

  _getScrollData() {
    //默认从url中获取，该情况为app内页面跳转，或小程序分享
    var argId = this.options.id;
    if (!argId){
      //没有的话从options.scene获取，此为获取小程序码B类接口的传参方式
      argId = decodeURIComponent(this.options.scene);
    }
    const params = {
      vid: argId
    }
    ajax.getVideoDetail(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const relatelist = res.relatelist ? res.relatelist.map(item => {
        if (item['vid']) item['id'] = item['vid']
        return item
      }) : '';
      const list = [{
        cover: res.cover,
        create_in: res.create_in,
        duration: res.duration,
        message: res.message,
        title: res.title,
        url: res.url,
        id: res.id || res.vid,
      }]
      this.setData({
        shareTitle: res.title,
        shareDesc: res.message,
        shareCover: res.cover,
        shareTime: res.duration,
        shareId: res.id || res.vid,
        title: res.sort,
        cover: res.cover,
        commentCount: res.comment_count,
        resource_type: 1,
        playUrl: res.url,
        id: res.id,
        list,
        relatelist,
        digestList: res.digest_comment,
        totalList: res.total_comment,
        is_praise: +res.is_praise,
        is_favorite: +res.is_favorite,
        praise_count: +res.praise_count || 0,
        tag_relatelist: res.tag_relatelist,
        share_record: res.share_record
      });
      var cov = res.total_comment
      var imglist = new Array()
      for (var i of cov) {
        if (i.cover == '') {
          this.setData({
            uploadimgs: ''
          })
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
      //this.getNetWork(res.url, res.id);
      wx.hideLoading()
    })
  },

  getNetWork(url, id) {
    var that = this;
    var hiddenVideoShow = true;
    wx.getNetworkType({
      success: function(result) {
        if(result.networkType == 'wifi') {
          hiddenVideoShow = false;
          ajax.getVideoUpdate(id);
          wx.createVideoContext("video").play();
        } else {
          url = '';
          wx.createVideoContext("video").pause();
        }
        that.setData({
          hiddenVideoShow: hiddenVideoShow,
          url: url
        })
      }
    })
  },

  update: function (e) {
    var time = e.detail.currentTime 
    if (time > 120.00 && time < 130.00) {
      this.setData({
        showImg: true
      })
      setTimeout(function () {
        that.setData({
          showImg: false
        })
      }, 5000)
    }
  },

  commentPraise(event) {
    var that = this;
    var list = {};

    const type = event.currentTarget.dataset.type;
    const id = event.currentTarget.id;
    // if (this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      if (type == 'digest') {
        list = this.data.digestList
      } else {
        list = this.data.totalList
      }

      if (list[id]['is_praise'] == 1) {
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

        if (type == 'diget') {
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

  //点赞
  onTapPraise(event) {
    // if (this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      if (this.data.is_praise) {
        wx.showToast({
          title: '您已点赞',
          image: '/images/icon-warn2.png',
          duration: 1200
        })
        return;//只能点赞，不能取消
      }

      if (this.timer) return;
      var formId = event.detail.formId;
      this.timer = true
      const is_praise = !this.data.is_praise
      const praise_count = is_praise ? ++this.data.praise_count : --this.data.praise_count
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
    // if(this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      if (this.timer) return;
      var formId = event.detail.formId;
      this.timer = true
      const is_favorite = !this.data.is_favorite
      const action = is_favorite ? 'add' : 'del'
      const params = {
        articleId: this.options.id,
        action: action,
        formId: formId
      }
      ajax.getMark(params).then(res => {
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

  //分享
  onTapShare(event) {
    var id = event.currentTarget.dataset.id
    // if (this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else {
      wx.navigateTo({
        url: `/pages/share/index?id=${id}&type=2`,
      })
      let params = {
        resourceId: this.data.shareId,
        type: 1
      }

      ajax.shareUpdate(params).then(res => {
      })
    // }
    // this.setData({
    //   share_view: true,
    //   maskHidden: false
    // });
    
  },

  viewAllComment() {
    wx.navigateTo({
      url: '/pages/reply/all?id=' + this.data.id
    })
  },

  playVideo(event) {
    const vid = this.data.id;

    ajax.getVideoUpdate({vid});

    this.setData({
      hiddenVideoShow: false,
      url: this.data.playUrl,
      autoplay: true,
    })
  },

  pageTo(id) {
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

  pageToReply(event) {
    // if (this.data.user == '') {
    //   var ids = this.data.id
    //   wx.showLoading({
    //     title: '即将跳转去登录',
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //     wx.setStorageSync('add', '/pages/video/video-detail/index?id=' + ids)
    //     wx.switchTab({
    //       url: '/pages/my/my'
    //     })
    //   }, 1000)
    // } else{
      wx.createVideoContext("video").pause();
      this.setData({
        isReply: true,
        isShow: true,
        textareaFocus: true
      }); 
    // }
  },



  onTapVideoDetail(event) {
    const id = event.currentTarget.id
    const url = `/pages/video/video-detail/index?id=${id}`
    wx.navigateTo({
      url
    })
  },

  gotohome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  onSubmitForm(event) {
    const params = event.detail.value;
    params['cover'] = this.data.uploadimgs;
    params['articleId'] = this.data.id;
    if (event.detail.formId) params['formId'] = event.detail.formId;
    if (!params['description']) return this.onModalTips('请填写评论内容');

    this.setData({
      disabled: true
    })

    this.onPostForm(params)
  },

  onPostForm(params) {
    const type = 1;
    const id = this.data.id;
    const totalList = this.data.totalList;
    const that = this;
    ajax.submitComment(params).then(res => {
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 3000
      })
      setTimeout(function () {
        wx.createVideoContext("video").play();
        const reply = {
          id:res.data.id,
          username:res.data.username,
          avatar:res.data.avatar,
          description:res.data.description,
          praise_count:res.data.praise_count,
          create_time:res.data.create_time,
          is_praise:res.data.is_praise
        }
        totalList.unshift(reply);
        that.setData({
          isReply: false,
          isShow: false,
          textareaFocus: false,
          totalList:totalList,
          commentCount: parseInt(that.data.commentCount) + 1,
          disabled: false,
          uploadimgs: ''
        });
      }, 1000);
      this._getScrollData()
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