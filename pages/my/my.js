
const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    avatar:"",
    flag: false,
    maskHidden: true,
    faqContent: true,
    value: '',
    draft:true
  },

  onLoad: function (options) {

  },
  onGotUserInfo(event) {
    wx.login({
      success: res => {
        if (event.detail.userInfo) {
          let params = {
            // appId: '',
            code: res.code,
            iv: event.detail.iv,
            encryptedData: event.detail.encryptedData,
          }

          ajax.userLogin(params, true).then(res => {
            var add = wx.getStorageSync('add')
            if (add == '') {
              wx.setStorageSync('userSession', res.data.userSession);
              wx.setStorageSync('userInfo', res.data.userInfo);

              this.setData({
                username: event.detail.userInfo.nickName,
                avatar: event.detail.userInfo.avatarUrl,
              });
              var user = wx.getStorageSync('userInfo');
              this.setData({
                value: user
              })
            } else {
              wx.setStorageSync('userSession', res.data.userSession);
              wx.setStorageSync('userInfo', res.data.userInfo);

              this.setData({
                username: event.detail.userInfo.nickName,
                avatar: event.detail.userInfo.avatarUrl,
              });
              var user = wx.getStorageSync('userInfo');
              wx.navigateTo({
                url: add,
              })
              wx.removeStorageSync('add')
            }
          });
        }
      }
    });    
    
  },
  onShow() {
    var user = wx.getStorageSync('userInfo');
    var modified = user.modified == 1 || !user.modified ? true : false;
    this.setData({
      username: user.username,
      avatar: user.avatar,
      admingroup: user.admingroup,
      modified: modified,
    })
    this.getMsgFlag(); 
    this.setData({
      value: user
    })
  },
  onHide: function () {
    wx.removeStorageSync('add')
  },

  goToDraft: function () {
    wx.navigateTo({
      url: '/pages/my/draft/index',
    })
  },
  //
  getMsgFlag: function () {
    var params = {
      time: app.data.startTime
    }
    ajax.unreadToast(params).then(res => {
      var totalMsg = res.data.totalToast;
      if (totalMsg > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: totalMsg.toString()
        })
      } else {
        wx.removeTabBarBadge({
          index: 2,
        })
      }

      if (res.data.answerDraftToast == 1) {
        this.setData({
          draft: true
        })
      } else {
        this.setData({
          draft: false
        })
      }
      if (res.data.praiseToast == 1 || res.data.commentToast == 1 ){
        this.setData({
          flag: true
        });

      } else {
        this.setData({
          flag: false
        });

      }
      wx.hideToast()
    })
  },

  viewFaq() {
    wx.navigateTo({
      url: '/pages/faq/index'
    })
  },

  editUserInfo() {
    wx.navigateTo({
      url: '/pages/my/edit'
    })
  },

  // 修改信息跳转
  myReviseClick() {
    wx.navigateTo({
      url: '/pages/my/edit'
    })
  },

  // 绑定手机跳转
  myPhoneClick() {
    wx.navigateTo({
      url: '/pages/my/phone/index'
    })
  },

  // 常见问题跳转
  myQuestionClick() {
    wx.navigateTo({
      url: '/pages/faq/index'
    })
  },

  closeDiv() {
    this.setData({
      faqContent: true,
      maskHidden: true,
    });
  },

  //我的收藏
  mymarkClick:function(){
    wx.navigateTo({
      url: '/pages/my/submy/submy?id=1'
    })
  },

  //我的消息
  myMsgClick: function () {
    wx.navigateTo({
      url: '/pages/my/submy/submy?id=2'
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

}))