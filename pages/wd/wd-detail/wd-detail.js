const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl;

Page(Object.assign({}, app.common, app.shareWDFn,{

  data: {
    tab:1,
    focus: false,
    page: 1,
    questionId:0,
    is_favorite: 0,
    uploadimgs:[],
    inputValue:'',
    pageend: false,
    list:[],
    huifuid:0, //回复的ID
    share_view: false //分享面板是否开启
  },

  onLoad(options) {
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    var that = this;
    var questionId = options.id;
    if (!questionId) {
      //没有的话从options.scene获取，此为获取小程序码B类接口的传参方式
      questionId = decodeURIComponent(this.options.scene);
    }

    var moblie = wx.getStorageSync('moblie');
    var isIphoneX = moblie['model'].indexOf('iPhone X') == 0 ? true : false;

    this.setData({
      questionId: questionId,
      isIphoneX: isIphoneX,
      user: userInfo,
      is_login: is_login,
    });

    //从我的里点进去的（消息标记为已读时调用接口）加参数 from, 标记为已读
    wx.setStorageSync('wdfrom', "");

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    })



    //wx.showLoading({ title: '加载中...' })
    //this._getScrollData()
  },

  onShow() {
    this.setData({
      page: 1
    })
    this._getScrollData();
  },

  onReachBottom() {
    if (this.data.pageend) return;

    // this.setData({
    //   page: ++this.data.page,
    // });
    this._getScrollData()
  },

  onPullDownRefresh() {
    // this._getScrollData()
  },

  _getScrollData() {

    let params = {
      page: this.data.page,
      questionId: this.data.questionId
    }

    ajax.getWDInfo(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        page: ++this.data.page,
        list: list,
        shareTitle: res.data.title,
        shareId: this.data.questionId,
        cover: res.data.cover,
        answer_count: res.data.answer_count,
        description: res.data.description,
        avatar: res.data.avatar,
        username:res.data.username,
        answerId: res.data.answerId,
        noResult,
        noMoreData,
      });

      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }, 2000)
    })
  },



  //分享
  onTapShare(event) {
    var id = this.data.questionId
    if (this.data.is_login == false) {
      this.getuser(event)
    } else {
      wx.navigateTo({
        url: `/pages/share/index?id=${id}&type=3`,
      })
      let params = {
        resourceId: this.data.questionId,
        type: 2
      }

      ajax.shareUpdate(params).then(res => { })
    }
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

  //回复详情
  itemclick(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wd/wd-hd/wd-hd?id=' + id + '&qid=' + this.data.questionId,
    })
  },

  //问答列表
  gotowdlist(){
    wx.navigateTo({
      url: '/pages/wd/wd',
    })
  },

  goToAnswer (e) {
    var id = e.currentTarget.dataset.id
    if (this.data.is_login == false) {
      this.getuser(e)
    } else {
      
      wx.navigateTo({
        url: '/pages/wd/answer/index?id=' + id + '&type=2&answerId=' + this.data.answerId,
      })
    }
  },

  //显示大输入框
  showBigInput(event) {
    if (this.data.is_login == false) {
      this.getuser(event)
      this.setData({
        is_login: true
      })
      this.showBigInput()
    } else {
      const oldScrollTop = event.currentTarget.dataset.scrolltop
      if (this.data.status == 2) {
        wx.showToast({
          title: '问答已锁定',
          image: '/images/icon-warn2.png',
          duration: 2000
        })
        return;
      }
      this.setData({
        tab: 2,
        focus: true,
        oldScrollTop: oldScrollTop
      });
    }
  },

  //显示回复输入框
  huifuclick(e) {
    if (this.data.status==2){
      wx.showToast({
        title: '问答已锁定',
        image: '/images/icon-warn2.png',
        duration: 2000
      })
      return;
    }
    var id = e.currentTarget.dataset.id;
    this.setData({
      tab: 3,
      huifuid: id,
      focus: true
    });
  },

  //隐藏
  inputcancel() {
    this.setData({
      tab: 1,
      focus: false
    });
  },
  //上传图片
  uploadclick(){
    var self = this;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: apiUrl.upload,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              appId: apiUrl.appId,
            },

            success: _res => {
              let file = JSON.parse(_res.data);
              if (file.data.url) {
                self.data.uploadimgs.push(file.data);
                self.setData({
                  uploadimgs: self.data.uploadimgs
                });
              }
            },
          })
        }
      }
    })
  },

  //移除上传的图片
  removeupload(e){
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < this.data.uploadimgs.length;i++){
      if(i==index){
        this.data.uploadimgs.splice(i, 1);
        break;
      }
    }
    this.setData({
      uploadimgs: this.data.uploadimgs
    });
  },

  answerInput(e){
    this.setData({
      inputValue: e.detail.value
    })
  },

  //回复TA
  answerTA(){
    let params = {
      answerId: this.data.huifuid,
      description: this.data.inputValue
    }

    ajax.saveWDPing(params).then(res => {
      this.setData({
        tab: 1,
        inputValue: ""
      });
      wx.hideToast();

      wx.showToast({
        title: "已提交",
        icon: 'success',
        duration: 1000
      });
    })
  },

  gotohome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  
  //回答
  answer() {

    var self = this;
    var str = JSON.stringify(this.data.uploadimgs);

    let params = {
      questionId: this.data.questionId,
      description: this.data.inputValue,
      uploadList: str
    }

    ajax.saveWD(params).then(res => {
      this.setData({
        tab: 1
      });
      
      wx.hideToast();

      wx.pageScrollTo({
        scrollTop: this.data.oldScrollTop
      })

      wx.showToast({
        title: "已提交",
        icon: 'success',
        duration: 1000
      });
      
    })
  },

  onPageScroll: function(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
  },

  //点赞
  dianzan(event) {
    var id = event.currentTarget.dataset.id;
    var state = event.currentTarget.dataset.state;
    const action = state == 0 ? 'add' : 'del';

    if (action=='del'){
      wx.showToast({
        title: '您已点赞',
        image: '/images/icon-warn2.png',
        duration: 1200
      })
      return;//只能点赞，不能取消
    }
    var formId = event.detail.formId;
    let params = {
      answerId: id,
      action: action,
      formId: formId
    }

    var self = this;
    ajax.answerPraise(params).then(res => {
      wx.hideToast()
      //修改前端状态
      for (var i = 0; i < self.data.list.length; i++){
        if(self.data.list[i].id == id){
          self.data.list[i].is_praise = state == 0 ? 1 : 0;
          if (state == 0) {
            self.data.list[i].praise_count = self.data.list[i].praise_count + 1
          } else {
            self.data.list[i].praise_count = self.data.list[i].praise_count - 1
          }
          break;
        }
      }
      self.setData({
        list: self.data.list
      });

      wx.showToast({
        title: state == 0 ? "已点赞":"已取消点赞",
        icon: 'success',
        duration: 1500
      })
    })
  },

  //收藏
  onTapMark(e) {
    if (this.data.is_login == false) {
      this.getuser(e)
    } else {
      var formId = e.detail.formId;
      const action = this.data.is_favorite == 0 ? 'add' : 'del'
      const params = {
        questionId: this.data.questionId,
        action: action,
        formId: formId,
      }

      ajax.questionFavorite(params).then(res => {
        this.setData({
          is_favorite: this.data.is_favorite == 0 ? 1 : 0
        });

        wx.showToast({
          title: action == 'add' ? "已收藏" : "已取消收藏",
          icon: 'success',
          duration: 1500
        })
      })
    }

  },

}))