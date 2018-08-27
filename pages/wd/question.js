const {ajax, util, common, apiUrl} = getApp()

Page(Object.assign({}, common, {

  data: {
    page: 1,
    pageend: false,
    list:[],
    uploadimgs:''
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我要提问'
    })
  },

  onSubmitForm(event) {
    const params = event.detail.value;
    params['cover'] = this.data.uploadimgs;
    if (event.detail.formId) params['formId'] = event.detail.formId
    if (!params['title']) return this.onModalTips('请填写问题标题')
    this.onPostForm(params)
  },

  onPostForm(params) {
    const header = {
      'Content-Type': 'application/json'
    }
    ajax.submitQuestion(params, header).then(res => {
      wx.showToast({
        title: '已提交',
        icon: 'success',
        duration: 3000
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/wd/wd'
        })
      }, 1000);
    })
  },

  uploadclick(){
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
                uploadimgs: file.data.url
              });
            }
          },
        })
      }
    })
  },

  //移除上传的图片
  removeupload(e){
    this.setData({
      uploadimgs: ''
    });
  },

}))