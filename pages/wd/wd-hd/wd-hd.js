const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, app.shareWDFn,{

  data: {
    tab: 1,
    focus: false,
    page: 1,
    ismark: 0,
    answerId: 0,
    pageend: false,
    list:[],
    inputflag:0, //1底部回复 2回复TA
    parentHfid:0, //回复某个人的回复ID
    share_view: false, //分享面板是否开启
    replyContent: true,
    maskHidden: true,
    inputflag: false,
    cursorSpacing: 82,
    is_login:''
  },

  onLoad(options) {
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    var answerId = options.id;
    this.setData({
      answerId: answerId,
      user: userInfo,
      is_login: is_login
    });
    this._getScrollData()

    wx.pageScrollTo({
      scrollTop: 840
    })
  },

  onReachBottom() {
    if (this.data.pageend) return;

    this.setData({
      page: ++this.data.page,
    });
    this._getScrollData()
  },

  onPullDownRefresh() {
    this._getScrollData()
  },

  _getScrollData() {
    
    let params = {
      page: this.data.page,
      answerId: this.data.answerId
    }

    //从我的里点进去的（消息标记为已读时调用接口）加参数 from, 标记为已读
    var t_from = wx.getStorageSync('wdfrom')
    if (t_from != ""){
      params.from = t_from
    }

    ajax.getOneWDInfo(params).then(res => {
      var pageend = res.data.list.length == 0;
      res.data.list = this.data.list.concat(res.data.list);
      var data = Object.assign(res.data, {
        pageend: pageend,
        shareTitle: res.data.question.title,
        shareId: res.data.question.id,
        cover: res.data.question.cover,
        answer:res.data.answer,
        praiseCount: res.data.answer.praise_count,
        isPraise: res.data.answer.is_praise,
      })
      this.setData(data)
      setTimeout(() => {
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  getuser: function (e) {
    var type = e.currentTarget.dataset.type
    var that = this
    var iv = e.detail.iv
    wx.login({
      success: function (res) {
        if (!!iv) {
          let params = {
            code: res.code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          }
          ajax.userLogin(params, true).then(res => {
            wx.setStorageSync('userSession', res.data.userSession);
            wx.setStorageSync('userInfo', res.data.userInfo)
            that.setData({
              is_login: true
            })
          })
        } else {

        }
      }
    })
  },

  //分享
  onTapShare(event) {
    this.setData({
      share_view: true
    });
  },

  //问答列表
  gotowdlist() {
    if (this.data.user == '') {
      wx.setStorageSync('add', 'pages/wd/wd-hd/wd-hd?id=' + id)
      wx.switchTab({
        url: '/pages/my/my'
      })
    } else {
      wx.navigateTo({
        url: '/pages/wd/wd',
      })
    }
  },

  clickReply: function (e) {
    if (this.data.is_login == false) {
      this.getuser(e)
    } else {
      var params = {
        answerId: this.data.answerId,
        description: this.data.value
      }

      if (this.data.inputflag == 1) {
        //回复TA
        params.parentId = this.data.parentHfid;
      }
      var self = this;
      ajax.saveWDPing(params).then(res => {
        this.setData({
          tab: 1,
          page: 1,
          list:[]
        });

        wx.hideToast();

        wx.pageScrollTo({
          scrollTop: this.data.oldScrollTop
        })

        setTimeout(function () {
          self._getScrollData();//刷新数据
        }, 500);

        wx.showToast({
          title: "已提交",
          icon: 'success',
          duration: 1000
        });
        this.setData({
          value: '',
          inputflag: false
        })
      })
    }
  },

  huifuclick(e) {
    var value = e.detail.value
    this.setData({
      value : value
    })
    // if (this.data.user == '') {
    //   wx.setStorageSync('add', 'pages/wd/wd-hd/wd-hd?id=' + id)
    //   wx.switchTab({
    //     url: '/pages/my/my'
    //   })
    // } else {
    //   if (this.data.question.status == 2) {
    //     wx.showToast({
    //       title: '问答已锁定',
    //       image: '/images/icon-warn2.png',
    //       duration: 2000
    //     })
    //     return;
    //   }

    //   var oldScrollTop = e.currentTarget.dataset.scrolltop
    //   var flag = e.currentTarget.dataset.flag;
    //   var parentHfid = 0;
    //   if (flag == 2) {
    //     parentHfid = e.currentTarget.dataset.id;
    //   }

    //   var username = e.currentTarget.dataset.username;
    //   var parentHfid = 0;
    //   var replayMessage = '评论';
    //   var replyUsername = this.data.answer.username;

    //   if (username) {
    //     parentHfid = e.currentTarget.dataset.id;
    //     replayMessage = '回复';
    //     replyUsername = username;
    //   }

    //   this.setData({
    //     tab: 3,
    //     focus: true,
    //     inputflag: flag,
    //     parentHfid: parentHfid,
    //     replayMessage: replayMessage,
    //     replyUsername: replyUsername,
    //     oldScrollTop: oldScrollTop
    //   });
    // }
  },

  /*
  //显示回复输入框
  huifuclick(e) {
    const parentHfid = e.currentTarget.dataset.id;

    if (this.data.question.status == 2) {
      wx.showToast({
        title: '问答已锁定',
        image: '/images/icon-warn2.png',
        duration: 2000
      })
      return;
    }

    this.setData({
      tab:3,
      parentHfid: parentHfid
    });

    var username = e.currentTarget.dataset.username;
    var parentHfid = 0;
    var replayMessage = '评论';
    var replyUsername = this.data.answer.username;

    if (username){
      parentHfid = e.currentTarget.dataset.id;
      replayMessage = '回复';
      replyUsername = username;
    }

    this.setData({
      replayMessage: replayMessage,
      replyUsername: replyUsername,
      replyContent: false,
      maskHidden: false,
      inputflag: true,
      autoFocus: true,
      parentHfid: parentHfid
    });

  },
  */

  hiddenReplyContent() {
    this.setData({
      replyContent: true,
      maskHidden: true,
    });
  },

  closeDiv() {
    this.setData({
      replyContent: true,
      maskHidden: true,
    });
  },

  //input 事件
  answerInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //隐藏
  inputcancel() {
    this.setData({
      tab: 1,
      focus: false
    });
  },

  onPageScroll: function(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
  },

  //回复TA
  answerTA(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      focus: true,
      parentHfid: id,
      inputflag: true
    })

  },

  /*
  //回复TA
  answerTA() {
    var params = {
      answerId: this.data.answerId,
      description: this.data.inputValue
    }

    if (this.data.inputflag){
      params.parentId = this.data.parentHfid;
    }
    var self = this;
    ajax.saveWDPing(params).then(res => {
      this.setData({
        inputValue: '',
        page: 1, //重置页码为1，然后刷新数据
        list: [],
        replyContent: true,
        maskHidden: true,
      });

      wx.showToast({
        title: "已提交",
        icon: 'success',
        duration: 1500
      });

      setTimeout(function(){
        self._getScrollData();//刷新数据
      }, 500);

    })
  },
  */

  //收藏
  onTapMark(event) {
    var formId = event.detail.formId;
    const action = this.data.question.is_favorite == 0 ? 'add' : 'del'
    const params = {
      questionId: this.data.question.id,
      action: action,
      formId: formId
    }

    ajax.questionFavorite(params).then(res => {
      this.data.question.is_favorite = this.data.question.is_favorite == 0 ? 1 : 0;
      this.setData({
        question: this.data.question
      });

      wx.showToast({
        title: action == 'add' ? "已收藏" : "已取消收藏",
        icon: 'success',
        duration: 1500
      })
    })
  },

  dianzan(event) {
    if (this.data.is_login == false) {
      this.getuser(event)
    } else {
      var id = event.currentTarget.dataset.id;
      var state = event.currentTarget.dataset.state;
      var isPraise = this.data.isPraise;
      var action = isPraise == 0 ? 'add' : 'add';

      let params = {
        answerId: id,
        action: action
      }

      var self = this;
      ajax.answerPraise(params).then(res => {
        wx.hideToast()
        self.setData({
          praiseCount: isPraise == 1 ? self.data.praiseCount : self.data.praiseCount + 1,
          isPraise: 1
        });

        wx.showToast({
          title: isPraise == 1 ? "您已点赞" : "点赞成功",
          icon: 'success',
          duration: 1500
        })
      })
    }
  },

  previewimg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: this.data.answer.piclist // 需要预览的图片http链接列表
    })
  },

}))