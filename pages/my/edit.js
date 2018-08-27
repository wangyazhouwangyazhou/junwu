const {ajax, util, common, apiUrl} = getApp()

Page(Object.assign({}, common, {

  data: {
  },

  onLoad: function (options) {
    var user = wx.getStorageSync('userInfo');

    this.setData({
      username: user.username,
      avatar: user.avatar,
    })
  },

  editUsername() {
    this.setData({
      editUsername: true
    })
    // if(modified) {
    //   this.setData({
    //     editUsername: true
    //   })
    // } else {
    //   wx.showToast({
    //     title: '仅限修改一次',
    //     image: '/images/x.png',
    //     duration: 2000
    //   })
    // }
  },

  conFirmUsernameEdit(event) {
    this.setData({
      editUsername: false,
      username: event.detail.value
    })
  },

  onSubmitForm(event) {
    var that = this;
    const params = new Array();
    params['username'] = this.data.username;
    params['avatar'] = this.data.avatar;
    if (!params['username']) {
      wx.showToast({
        title: '没有填写昵称',
        image: '/images/x.png',
        duration: 2000
      })
      return
    }

    this.onPostForm(params)
  },

  onPostForm(params) {
    const header = {
      'Content-Type': 'application/json'
    }
    ajax.userEdit(params, header).then(res => {
      wx.setStorageSync('userInfo', res.data.userInfo);
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 3000
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/my/my'
        })
      }, 1000);
    })
  },

  editAvatar(){
    var self = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: apiUrl.upload,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            appId: apiUrl.appId,
          },

          success: _res => {
            let file = JSON.parse(_res.data);
            if (file.data.url) {
              self.setData({
                avatar: file.data.url
              });
            }
          },
        })
      }
    })
  },

}))