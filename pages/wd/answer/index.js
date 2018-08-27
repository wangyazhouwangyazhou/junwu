// pages/wd/answer/index.js
const app = getApp();
const ajax = app.ajax;
const apiUrl = app.apiUrl;

Page(Object.assign({}, app.common, app.shareWDFn, {

  /**
   * 页面的初始数据
   */
  data: {
    contentList: [],
    list: [],
    questionId: '',
    showInput: false,
    focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var answerId = options.answerId
      var id = options.qid
      var type = options.type
      if ( type == 2) {
        var id = options.id
        if (answerId == 0) {
          this.setData({
            questionId: id,
            type: type,
            answerId: answerId
          })
        } else {
          const params = {
            id: answerId,
          }
          ajax.answerDraftDetail(params).then(res => {
            this.setData({
              contentList: res.data.description
            })
          })
          this.setData({
            questionId: id,
            type: type,
            answerId: answerId
          })
        }

      } else {
        this.setData({
          questionId: id,
          type: type,
          answerId: answerId
        })
        const params = {
          id: id
        }
        ajax.answerDraftDetail(params).then(res => {
          this.setData({
            page: ++this.data.page,
            list: res.data,
            contentList: res.data.description,
            question_id: res.data.question_id,
            answerid : res.data.id
          });
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

  },

  add:function(e) {
    this.addTxt(e)
  },

  save : function (e) {
    if (this.data.contentList == '') {
      this.onModalTips('请填写评论内容');
    } else {
      if (this.data.type == 1) {
        var str = JSON.stringify(this.data.contentList);
        let params = {
          questionId: this.data.question_id,
          description: str,
          type: 2,
          answerId: this.data.answerid
        }

        ajax.saveWD(params).then(res => {
          if (res.code == 1) {

          } else {
            wx.showToast({
              title: "已保存至草稿箱",
              icon: 'success',
              duration: 5000
            });
          }
        })
        
      } else {
        var str = JSON.stringify(this.data.contentList);
        let params = {
          questionId: this.data.questionId,
          description: str,
          type: 2,
          answerId: this.data.answerId
        }

        ajax.saveWD(params).then(res => {
          if (res.code == 1) {
            
          } else {
            wx.showToast({
              title: "已保存至草稿箱",
              icon: 'success',
              duration: 6000,
            });
            this.setData({
              answerId: 1
            })
          }
        })
      }
    }
  },

  submit : function (e) {
    var str = JSON.stringify(this.data.contentList);
    if ( this.data.type == 2) {
      if (this.data.contentList == '') return this.onModalTips('请填写评论内容');
      var params = {
        questionId: this.data.questionId,
        description: str,
        type: 1,
        answerId: this.data.answerId
      }
      if (!params['description']) return this.onModalTips('请填写评论内容');
      ajax.saveWD(params).then(res => {
        if (!res.code == 1) {
          wx.showToast({
            title: "已提交",
            icon: 'success',
            duration: 3000
          });
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      var params = {
        questionId: this.data.question_id,
        description: str,
        type: 1,
        answerId: this.data.answerid
      }
      ajax.saveWD(params).then(res => {
        wx.showToast({
          title: "已提交",
          icon: 'success',
          duration: 1000
        });
      })
      wx.redirectTo({
        url: '/pages/wd/wd-detail/wd-detail?id=' + this.data.question_id,
      })
    }
  },

  order: function (e) {
    var contentList = this.data.contentList
    var index = e.currentTarget.dataset.id
    var tit = contentList[index]

    if (contentList[index + 1] == undefined ) {
      wx.showToast({
        title: '这是最后一个',
        icon: 'none',
        duration: 2000
      })
    } else {
      contentList[index] = contentList[index + 1]
      contentList[index + 1] = tit;
    }
    this.setData({
      contentList: this.data.contentList,
    })
  },

  more: function (event) {
    var that = this
    wx.showActionSheet({
      itemList: ['插入内容','删除内容'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.insert(event)
        } else if (res.tapIndex == 1) {
          that.remove(event)
        }
      }
    })
    var index = event.currentTarget.dataset.id
    this.setData({
      function:true,
      listIndex: index
    })
  },

  insert: function (event) {
    var that = this
    wx.showActionSheet({
      itemList: ['文字', '图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.text(event)
        } else if (res.tapIndex == 1) {
          that.Photo(event)
        }
      }
    })
  },

  Photo: function (event) {
    var current = event.currentTarget.dataset.id
    var that = this
    var contentList = this.data.contentList;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],

      success: function (res) {
        var url = res.tempFilePaths[0]
        wx.getImageInfo({
          src: url,
          success: function (res) {
            var height = res.height
            var width = res.width
            that.setData({
              width: width,
              height: height
            })
          }
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var url = res.tempFilePaths[i];

          wx.uploadFile({
            url: apiUrl.upload,
            filePath: res.tempFilePaths[i],

            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },

            formData: {
              appId: apiUrl.appId
            },

            success: function (res) {
              if (res.data) {
                var fileName = JSON.parse(res.data)
                if (fileName) {
                  contentList.splice(current + 1, 0, { type: 'pic', content: fileName.data, height: that.data.height, width: that.data.width, tempFilePaths: url});
                  that.setData({
                    contentList: contentList
                  })

                }
              }
            },
          })
        }
      }
    })
  },

  remove: function (e) {
    var that = this;
    const current = e.currentTarget.dataset.id;
    if (this.data.answerId == 0){
      const contentList = this.data.contentList;
      wx.showModal({
        title: '提示',
        content: '确定是否要删除该内容',
        success: function (res) {
          if (res.confirm) {
            contentList.splice(current, 1);
            that.setData({
              contentList: contentList
            })
          }
        }
      })
    } else {
      const contentList = this.data.contentList;
      wx.showModal({
        title: '提示',
        content: '确定是否要删除该内容',
        success: function (res) {
          if (res.confirm) {
            contentList.splice(current, 1);
            that.setData({
              contentList: contentList
            })
          }
        }
      })
    }
    
  },


  goToPosters: function (e) {
    if (this.data.contentList == '') return this.onModalTips('请填写评论内容');
    var str = JSON.stringify(this.data.contentList);
    if (this.data.type == 1) {
      var params = {
        questionId: this.data.question_id,
        description: str,
        type: 1,
        answerId: this.data.questionId
      }
      ajax.saveWD(params).then(res => {
        if (!res.code == 1) {
          wx.showToast({
            title: "已提交",
            icon: 'success',
            duration: 1000
          });
          wx.setStorageSync('contentList', this.data.contentList)
          wx.redirectTo({
            url: '/pages/wd/posters/index?id=' + this.data.question_id,
          })
        }
      })
    } else {
      if (!this.data.answerId == 0) {
        var params = {
          questionId: this.data.questionId,
          description: str,
          type: 1,
          answerId: this.data.answerId
        }
        ajax.saveWD(params).then(res => {
          if (!res.code == 1) {
            wx.showToast({
              title: "已提交",
              icon: 'success',
              duration: 1000
            });
            wx.setStorageSync('contentList', this.data.contentList)
            wx.redirectTo({
              url: '/pages/wd/posters/index?id=' + this.data.questionId,
            })
          }
        })
      } 
    }    
  },

  saveTitle(event) {
    const value = event.detail.value;
    const current = event.currentTarget.dataset.current;
    const contentList = this.data.contentList;
    const textLength = event.detail.cursor
    contentList.splice(current, 1, { type: 'txt', content: value, length: textLength});
    this.setData({
      // value: '',
      textLength: value.length
    })
  },

  text: function(e) {
    var current = e.currentTarget.dataset.id
    var contentList = this.data.contentList
    contentList.splice(current + 1, 0, { type: 'txt', content: '', length: this.data.textLength });
    this.setData({
      contentList: contentList
    })
  },

  addTxt : function () {
    var contentList = this.data.contentList;
    contentList.push({ type: 'txt', content: this.data.value, length: this.data.textLength });
    this.setData({
      contentList: contentList,
    })
  },

  uploadPhoto:function (event) {
    var that = this
    var contentList = this.data.contentList;
    wx.showLoading({
      title: '加载中',
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],

      success: function (res) {
        var url = res.tempFilePaths[0]
        wx.getImageInfo({
          src: url,
          success:function(res) {
            var height = res.height
            var width = res.width
            that.setData({
              width: width,
              height: height
            })
          }
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var url = res.tempFilePaths[i];

          wx.uploadFile({
            url: apiUrl.upload,
            filePath: res.tempFilePaths[i],

            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },

            formData: {
              appId: apiUrl.appId
            },

            success: function (res) {
              if (res.data) {
                var fileName = JSON.parse(res.data)
                if (fileName) {
                  contentList.push({ type: 'pic', content: fileName.data, height: that.data.height, width:that.data.width, tempFilePaths: url});
                  that.setData({
                    contentList: contentList
                  })
                  wx.hideLoading()
                }
              }
            },
          })
        }
      }
    })
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