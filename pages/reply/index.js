const {ajax, util, common, apiUrl} = getApp()

Page(Object.assign({}, common, {

  data: {
    page: 1,
    pageend: false,
    list:[],
    uploadimgs:'',
    disabled: false,
    aid : "",
    value: '',
    img : '',
    pid:''
  },
  removeupload(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      uploadimgs: ''
    });
  },

  hideForm: function () {
    wx.navigateBack({
      delta:1
    })
  },

  uploadPicture: function () {
      var self = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          wx.showLoading({
            title: '上传图片',
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
    const id = options.id;
    const type = options.type;
    const replay = options.replay
    const aid = options.aid
    const pid = options.pid
    this.setData({
      id: id,
      type: type,
      replay: replay,
      aid: aid,
      pid: pid
    });

    if (type == 1 ) {
      wx.setNavigationBarTitle({
        title: '回复'
      })
    } else if( type == 2) {
      wx.setNavigationBarTitle({
        title: '发表评论'
      })
    } else if (type == 3) {
      wx.setNavigationBarTitle({
        title: '回复'
      })
    }

  },

  onSubmitForm(event) {
    const params = event.detail.value;
    this.setData({
      value: params.description
    })
    params['articleId'] = this.data.id;
    params['type'] = this.data.type;
    params['cover'] = this.data.uploadimgs;
    if (event.detail.formId) params['formId'] = event.detail.formId;
    if (!params['description']) return this.onModalTips('请填写评论内容');

    this.setData({
      disabled: true
    })
    if (this.data.type == 3) {
      const param = event.detail.value;
      const description = param['description']
      let params = {
        page: this.data.page,
        articleId: this.data.aid,
        replyId: 0,
        description: description,
        commentId: this.data.id,
      }
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 3000
      })
      ajax.replySave(params).then(res => {
        var id = this.data.id
        var aid = this.data.aid
        // wx.redirectTo({
        //   url: '/pages/reply/replyList?id=' + id + '&aid=' + aid + '&type=3',
        // })
        wx.navigateBack({
          delta: 1,
        })
      })
    } else if (this.data.type == 1) {
      const param = event.detail.value;
      const description = param['description']
      let params = {
        page: this.data.page,
        articleId: this.data.aid,
        replyId:this.data.id,
        description: description,
        commentId: this.data.pid,
      }
      
      ajax.replySave(params).then(res => {
        var id = this.data.id
        var aid = this.data.aid
        wx.navigateBack({
          delta:1
        })
      })
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 3000
      })
    } else if (this.data.type == 2) {
      this.onPostForm(params)
    }
  },

  onPostForm(params) {
    var that = this;
    const type = this.data.type;
    const id = this.data.id;
    ajax.submitComment(params).then(res => {
      setTimeout(function () {
        that.setData({
          disabled: false
        })

        if(type == 1) {
          wx.redirectTo({
            url: '/pages/video/video-detail/index?id=' + id
          })
        } else {
          wx.redirectTo({
            url: '/pages/article/index?is_show=ok&id=' + id 
          })
          // wx.navigateBack({
          //   delta: 1,
          // })
        }
       
      }, 1000);
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 3000
      })
    })

    // ajax.unreadToast(params).then(res => {
    //   var zan = res.data.praiseToast == 1 ? true : false;
    //   var ping = res.data.commentToast == 1 ? true : false;
    //   var totalMsg = res.data.totalToast;
    //   this.setData({
    //     zan: zan,
    //     ping: ping,
    //   });
    //   wx.setTabBarBadge({
    //     index: 2,
    //     text: totalMsg.toString()
    //   })
    // })
  },

}))