const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl

Page(Object.assign({}, app.common, app.videoFn, app.shareFn, {
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    is_login: '',
    showInput: false,
    supportnum: '',
    likeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    wx.setNavigationBarTitle({
      title: '军武PK赛'
    })
  },

  _getNavScrollData() {
    var arr =  []
    const params = {
      page: this.data.page,
      id: this.data.id
    }
    ajax.pkdetail(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.comments, this.data.list)
      this.setData({
        page: ++this.data.page,
        pk: res.pk,
        options: res.options,
        list,
        supportnum: res.support,
        noMoreData: noMoreData,
        option1: res.options.list[0].id,
        option2: res.options.list[1].id,
        noResult,
        noMoreData,
        total:res.comments.total
      })
    })
  },

  clickGood : function (e) {
    var id = e.currentTarget.dataset.id
    var commentId = e.currentTarget.dataset.commentid
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    if (list[index]['ispraise'] == 1) {
      wx.showToast({
        title: '您已点赞',
        icon: 'error',
        duration: 1200
      })
      return;
    }
    const cid = list[index]['id'];
    var params = {
      id: id,
      commentId: commentId
    }
    ajax.pkcommentPraise(params).then(res => {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == cid) {
          list[i].ispraise = 1;
          list[i].praise_count = parseInt(list[i].praise_count) + 1
        }
      }
      wx.showToast({
        title: "已点赞",
        icon: 'success',
        duration: 1200
      })
      this.setData({
        list:list,
      })
      // this._getNavScrollData()
    })
  },

  gotohome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  support: function (e) {
    var id = e.currentTarget.dataset.id
    var optionid = e.currentTarget.dataset.optionid
    var params = {
      id: id,
      optionid: optionid
    }
    ajax.pksubmit(params).then(res => {
      this.setData({
        support: optionid
      })
      this._getNavScrollData()
    })
  },

  comments: function (e) {
    this.setData({
      showInput: true,
      focus: true
    })
  },

  bindinput: function (e) {
    var value = e.detail.value
    var cursor = e.detail.cursor
    if (cursor == 200) {
      wx.showToast({
        title: '最多输入200字',
        icon: 'none',
        duration: 2000
      })
    }

    this.setData({
      value: value,
      cursor: cursor
    })
  },

  bindblur: function (e) {
    this.setData({
      showInput: false,
    })
  },

  pk:function () {
    this.setData({
      showInput: false,
    })
  },
  
  submit: function (e) { 
    var id = e.currentTarget.dataset.id
    if (this.data.value == undefined) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      var params = {
        description: this.data.value,
        id: id
      }
      ajax.pkcommentSave(params).then(res => {
        this.setData({
          showInput: false,
          page: 1,
          value:''
        })
        this._getNavScrollData()
      })
    }
  },

  onTapShare(event) {
    var id = event.currentTarget.dataset.id
    let params = {
      resourceId: id,
      type: 5
    }

    ajax.shareUpdate(params).then(res => { })

    
    wx.navigateTo({
      url: `/pages/share/index?id=${id}&type=4`,
    })
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
              that.comments(event)
            } else if (type ==3 ) {
              that.support(event)
            } else if( type ==4) {
              that.clickGood(event)
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    this.setData({
      is_login: is_login
    })
    this._getNavScrollData()
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
    this._getNavScrollData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getNavScrollData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))