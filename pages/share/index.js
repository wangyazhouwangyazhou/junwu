const app = getApp()
const ajax = app.ajax
const util = app.util
Page(Object.assign({}, app.common, app.shareArticleFn, {

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    url : '',
    types: '',
    all: true,
    answer: false,
    img: '',
    username : '',
    time: '',
    act:'',
    tit: '',
    summary: '',
    id: '',
    page: ''
  },
  // template/share/index.js
    closeSharePanel() {
      this.setData({
        share_view: false
      });
    },
    
    onLoad: function (options) {
      this.setData({
        types: options.type,
        id: options.id
      })
      if (this.data.types == 1) {
        this.setData({
          all: true,
          answer: false
        })
        let params = {
          articleId: this.data.id
        }

        ajax.getArticleDetail(params).then(res => {
          this.setData({
            list: res.data,
          })
        })
      } else if (this.data.types == 2) {
        let params = {
          vid: options.id
        }
        ajax.getVideoDetail(params).then(res => {
          this.setData({
            list: res,
            all: false,
            answer: true
          })
        })
      } else if (this.data.types == 3) {
        this.setData({
          all: true,
          answer: false
        })
        let params = {
          questionId: options.id
        }
        ajax.getWDInfo(params).then(res => {
          this.setData({
            list: res.data,
            title: res.data.title
          })
        })
      } else if (this.data.types == 4) {
        this.setData({
          all: true,
          answer: false
        })
        let params = {
          id: options.id,
          page:1
        }
        ajax.pkdetail(params).then(res => {
          this.setData({
            list: res.pk,
            support: res.support,
            options:res.options,
            img0: res.options.list[0].cover,
            img1: res.options.list[1].cover,
            title: res.pk.title
          })
        })
      }
    },

    //分享微信朋友圈
    sharewxquan(e) {
      var now = new Date()
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      this.setData({
        time: year + '-' + month + '-' + day
      })

      if (this.data.types == 2 || this.data.types == 3) {

        var img = e.currentTarget.dataset.img
        var tit = e.currentTarget.dataset.tit
        // var summary = e.currentTarget.dataset.message
        var share_desc = e.currentTarget.dataset.share_desc
        this.setData({
          img: img,
          tit: tit,
          summary: share_desc,
          id: this.data.id
        })
        wx.showLoading({ title: '生成中' })

        var self = this;
        wx.getSystemInfo({
          success: function (res) {
            self.setData({
              width: res.screenWidth,
              height: res.screenHeight
            });
            self.downCover();
          }
        })
      } else if (this.data.types == 1) {

        var img = e.currentTarget.dataset.img
        var tit = e.currentTarget.dataset.tit
        var summary = e.currentTarget.dataset.summary
        var share_desc = e.currentTarget.dataset.share_desc
        this.setData({
          img: img,
          tit: tit,
          summary: share_desc,
          id: this.data.id
        })

        wx.showLoading({ title: '生成中' })

        var self = this;
        wx.getSystemInfo({
          success: function (res) {
            self.setData({
              width: res.screenWidth,
              height: res.screenHeight
            });
            self.downCover();
          }
        })
      } else if (this.data.types == 4) {
        var list = this.data.list
        this.setData({
          tit: list.title,
        })

        wx.showLoading({ title: '生成中' })

        var self = this;
        wx.getSystemInfo({
          success: function (res) {
            self.setData({
              width: res.screenWidth,
              height: res.screenHeight
            });
            self.downCover();
          }
        })
      }
    },

    downCover: function () {
      var self = this;
      if (self.data.types == 4 ) {
        wx.downloadFile({
          url: self.data.img0,
          success: function (res) {
            var cover = res.tempFilePath
            wx.showLoading({ title: '生成中.' })
            self.downCover1(cover)
          },
          fail: function (res) {
          }
        })
      } else {
        wx.downloadFile({
          url: self.data.img,
          success: function (res) {
            var cover = res.tempFilePath
            wx.showLoading({ title: '生成中.' })
            self.avatar(cover)
          },
          fail: function (res) {
          }
        })
      }
    },
    downCover1: function (_cover) {
      var self = this;
      wx.downloadFile({
        url: self.data.img1,
        success: function (res) {
          var cover = res.tempFilePath
          wx.showLoading({ title: '生成中.' })
          self.avatar(_cover,cover)
        },
        fail: function (res) {
        }
      })
    },


    avatar: function (_cover, cover) {
      var self = this;
      const userInfo = wx.getStorageSync('userInfo');
      self.setData({
        username: userInfo.username,
        avatar: userInfo.avatar
      })
      wx.downloadFile({
        url: self.data.avatar,
        success: function (res) {
          var cover2 = res.tempFilePath
          wx.showLoading({ title: '生成中.' })
          self.downQRCode(_cover, cover2, cover)
        },
      })
    },

    downQRCode: function (_cover, _cover2, cover) {
      if (this.data.types == 1) {
        this.setData({
          page: 'pages/article/index'
        })
      } else if (this.data.types == 2) {
        this.setData({
          page: 'pages/video/video-detail/index'
        })
      } else if (this.data.types == 3) {
        this.setData({
          page: 'pages/wd/wd-detail/wd-detail'
        })
      } else {
        this.setData({
          page: 'pages/pk/detail' 
        })
      }

      var self = this;
      var page = self.data.page;
      var scene = self.data.id;
      const app = getApp();
      var appid = app.apiUrl.appId;
      var apiUrl = app.apiUrl.apiUrl
      var codeurl = apiUrl + '?appId=' + appid + '&scene=' + scene + '&page=' + page;
      wx.downloadFile({
        url: codeurl,
        success: function (res) {
          var qrcoder = res.tempFilePath
          wx.showLoading({ title: '生成中..' })
          self.drawAll(_cover, _cover2, qrcoder, cover);
        }
      })
    },

    drawAll: function (_cover, _qrcode, _cover2, cover) {
      if (this.data.types == 4) {
        var path = "/images/share-pk.png";
      } else {
        var path = "/images/share-bg.png";
      }

      var path2 = _cover;
      var path5 = cover
      var path3 = _qrcode;
      var path4 = _cover2;
      var ctx = wx.createCanvasContext('myCanvas')
      var width = 750
      var height = 1000
      if (this.data.types == 4) {
        var x3 = 47
        var y3 = 540
        var w3 = 100
        var h3 = 100
        ctx.drawImage(path3, x3, y3, w3, h3)
      } else {
        var x3 = 47
        var y3 = 475
        var w3 = 100
        var h3 = 100
        ctx.drawImage(path3, x3, y3, w3, h3)
      }


      //绘制背景
      ctx.drawImage(path, 0, 0, width, height)
      
      if (this.data.types == 1) {
        this.setData({
          act: '在军武小程序阅读这篇文章'
        })
      } else if (this.data.types == 2) {
        this.setData({
          act: '在军武小程序观看这条视频'
        })
      } else if (this.data.types == 3) {
        this.setData({
          act: '在军武小程序参与这个问答'
        })
      } else if (this.data.types == 4) {
        this.setData({
          act: '在军武小程序参与本次PK赛'
        })
      }
      //绘制cover
      if (this.data.types == 1 || this.data.types == 2) {
        var x2 = 7
        var y2 = 10
        var w2 = 735
        var h2 = 436
        ctx.drawImage(path2, x2, y2, w2, h2)
        
      } else if (this.data.types == 3) {
        var x2 = 70
        var y2 = 20
        var w2 = 620
        var h2 = 437
        ctx.drawImage(path2, x2, y2, w2, h2)
      } else {
        var x2 = 26
        var y2 = 20
        var w2 = 347
        var h2 = 341
        ctx.drawImage(path2, x2, y2, w2, h2)

        var xx2 = 380
        var yx2 = 20
        var wx2 = 347
        var hx2 = 341
        ctx.drawImage(path5, xx2, yx2, wx2, hx2)

        var path6 = '/images/VS.png'
        var xx2 = 269
        var yx2 = 103
        var wx2 = 247
        var hx2 = 117
        ctx.drawImage(path6, xx2, yx2, wx2, hx2)

        var path8= '/images/back.png'
        var path8x = 26
        var path8y = 255
        var path8w = 698
        var path8h = 105
        ctx.drawImage(path8, path8x, path8y, path8w, path8h)


        ctx.setFontSize(33)
        ctx.setTextAlign('center')
        ctx.setFillStyle('#fff')
        var txt4_xx = 375
        var txt4_yx = 290
        this.drawTxt(ctx, this.data.list.title, txt4_xx, txt4_yx, 16, 50, 1)

        ctx.setFontSize(42)
        ctx.setTextAlign('right')
        ctx.setFillStyle('#fff')
        var txt4_xx = 320
        var txt4_yx = 345
        this.drawTxt(ctx, this.data.options.list[0].title, txt4_xx, txt4_yx, 16, 50, 1)

        ctx.setFontSize(42)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#fff')
        var txt4_xx = 420
        var txt4_yx = 345
        this.drawTxt(ctx, this.data.options.list[1].title, txt4_xx, txt4_yx, 16, 50, 1)

        ctx.setFillStyle('#bdd5e2')
        var ratio = this.data.options.list[0].ratio
        ctx.fillRect(26, 373, 300, 29)

        ctx.setFillStyle('#55c5ff')
        ctx.fillRect(26 + (300 * ((100 - ratio) / 100)), 373, (300 * (ratio / 100)), 29)

        ctx.setFontSize(26)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        var ratio = this.data.options.list[0].ratio
        var ratiox = 246
        var ratioy = 397
        this.drawTxt(ctx, ratio + '%' , ratiox, ratioy, 16, 50, 1)

        ctx.setFillStyle('#ff5555')
        var ratio2 = this.data.options.list[1].ratio
        ctx.fillRect(430, 373, 300 * (ratio2 / 100), 29)

        ctx.setFillStyle('#f1b3b3')
        ctx.fillRect(430 + (300 * (ratio2 / 100)), 373, 300 - (300 * ratio2 / 100), 29)

        ctx.setFontSize(26)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        var ratio = this.data.options.list[1].ratio
        var ratio2x = 460
        var ratio2y = 397
        this.drawTxt(ctx, ratio2 + '%', ratio2x, ratio2y, 16, 50, 1)


        var path7 = '/images/progresss.png'
        var path7x2 = 295
        var path7y2 = 318
        var path7w2 = 161
        var path7h2 = 137
        ctx.drawImage(path7, path7x2, path7y2, path7w2, path7h2)
        
        if (this.data.support == this.data.options.list[0].id) {
          var path9 = '/images/detail-blue-change.png'
          var path9x2 = 80
          var path9y2 = 430
          var path9w2 = 181
          var path9h2 = 60
          ctx.drawImage(path9, path9x2, path9y2, path9w2, path9h2)
        } else if (this.data.support == 0) {
          var path9 = '/images/detail-blue.png'
          var path9x2 = 80
          var path9y2 = 430
          var path9w2 = 181
          var path9h2 = 60
          ctx.drawImage(path9, path9x2, path9y2, path9w2, path9h2)
        } else {
          var path9 = '/images/detail-gray.png'
          var path9x2 = 80
          var path9y2 = 430
          var path9w2 = 181
          var path9h2 = 60
          ctx.drawImage(path9, path9x2, path9y2, path9w2, path9h2)
        }

        if (this.data.support == this.data.options.list[1].id) {
          var path10 = '/images/detail-red-change.png'
          var path10x2 = 480
          var path10y2 = 430
          var path10w2 = 181
          var path10h2 = 60
          ctx.drawImage (path10, path10x2, path10y2, path10w2, path10h2)
        } else if (this.data.support == 0) {
          var path10 = '/images/detail-red.png'
          var path10x2 = 480
          var path10y2 = 430
          var path10w2 = 181
          var path10h2 = 60
          ctx.drawImage(path10, path10x2, path10y2, path10w2, path10h2)
        }else {
          var path10 = '/images/detail-gray.png'
          var path10x2 = 480
          var path10y2 = 430
          var path10w2 = 181
          var path10h2 = 60
          ctx.drawImage (path10, path10x2, path10y2, path10w2, path10h2)
        }

      }
      if (this.data.types == 4) {
        ctx.setFontSize(36)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        var txt1_x = 160
        var txt1_y = 595
        this.drawTxt(ctx, this.data.username, txt1_x, txt1_y, 14, 45, 2)

        ctx.setFontSize(24)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#868686')
        var txt2_x = 160
        var txt2_y = 625
        this.drawTxt(ctx, this.data.time, txt2_x, txt2_y, 14, 45, 2)

        ctx.setFontSize(24)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#868686')
        var txt3_x = 290
        var txt3_y = 625
        this.drawTxt(ctx, this.data.act, txt3_x, txt3_y, 14, 45, 2)


        ctx.setFontSize(40)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000000')
        var txt4_x = 100
        var txt4_y = 725
        this.drawTxt(ctx, this.data.tit, txt4_x, txt4_y, 14, 50, 2)

      } else {
        ctx.setFontSize(36)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        var txt1_x = 160
        var txt1_y = 530
        this.drawTxt(ctx, this.data.username, txt1_x, txt1_y, 14, 45, 2)

        ctx.setFontSize(24)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#868686')
        var txt2_x = 160
        var txt2_y = 560
        this.drawTxt(ctx, this.data.time, txt2_x, txt2_y, 14, 45, 2)


        ctx.setFontSize(24)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#868686')
        var txt3_x = 290
        var txt3_y = 560
        this.drawTxt(ctx, this.data.act, txt3_x, txt3_y, 14, 45, 2)


        ctx.setFontSize(40)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000000')
        var txt4_x = 100
        var txt4_y = 640
        this.drawTxt(ctx, this.data.tit, txt4_x, txt4_y, 14, 50, 2)

        ctx.setFontSize(24)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#868686')
        var txt5_x = 100
        var txt5_y = 760
        this.drawTxt(ctx, this.data.summary, txt5_x, txt5_y, 25, 40, 2)
      }
    
      // //绘制二维码
      var x6 = 150
      var y6 = 870
      var w6 = 120
      var h6 = 120
      ctx.drawImage(path4, x6, y6, w6, h6)

      ctx.draw()

      wx.showLoading({ title: '生成中...' })
      var self = this;
      setTimeout(function () {
        wx.showLoading({ title: '生成中....' })
        self.previewHB();
      }, 1000);

    },

    previewHB: function (res) {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          // wx.previewImage({
          //   urls: [res.tempFilePath]
          // })
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function (res) {
              wx.showModal({
                title: '海报已保存到系统相册',
                content: '快去分享给朋友，叫小伙伴来围观吧',
                showCancel: false,
                confirmText: '我知道了',
              })
            }
          })
        },
        complete: function (e) {
          wx.hideLoading()
        }
      })
    },

    //换行
    drawTxt: function (ctx, _str, _x, _y, _total, _lineh, _linenum) {
      if (_str == "" || _str == undefined) {
        return;
      }
      var total = _total ? _total : 15; //每行字数（数字算半个）
      var lineH = _lineh ? _lineh : 20; //行间距
      var lineNum = _linenum ? _linenum : 4; //最大显示行数

      /*
      拆解字符串到数组，按行，每行15个（判断数字占半个，其他占1个）
      */
      var lineArray = [];
      var len = 0; //数字算半个，中文算一个
      for (var i = 0; i < _str.length; i++) {
        var line = '';
        if (Math.ceil(len) % total == 0) {
          if (lineArray[lineArray.length - 1] != "") {
            lineArray.push("");
          }
        }
        var index = Math.floor(len / total); //
        lineArray[index] = lineArray[index] + _str[i];

        if (!isNaN(_str[i])) {
          //是数字
          len = len + 0.5;
        } else {
          len = len + 1;
        }
      }

      for (var i = 0; i < lineArray.length; i++) {
        var t_str = lineArray[i];
        if (lineArray.length > lineNum && i == (lineNum - 1)) {
          //如果总行数大于设定的行数，则到最大设定行时，加省略号，退出
          t_str = t_str + '...'
          ctx.fillText(t_str, _x, _y + lineH * i);
          break;
        } else {
          ctx.fillText(t_str, _x, _y + lineH * i);
        }
      }
    },
    //换行
    drawTxt2: function (ctx, _str, _x, _y) {
      if (_str == "" || _str == undefined) {
        return;
      }
      var total = 15; //每行字数
      var lineH = 20; //行间距
      var lineNum = 4; //最大显示行数

      for (var i = 0; i < _str.length / total; i++) {
        var t_str = _str.substr(i * total, total);
        if (_str.length / total > lineNum && i == (lineNum - 1)) {
          //如果总行数大于设定的行数，则到最后设定行时，加省略号，退出
          t_str = t_str + '...'
          ctx.fillText(t_str, _x, _y + lineH * i);
          break;
        } else {
          ctx.fillText(t_str, _x, _y + lineH * i);
        }

      }
    },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onShareAppMessage: function (res) {
    var types = this.data.types
    var id = this.data.id
    // util.getUserInfo()
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (types == 1) {
        return {
          title: this.data.list.title,
          path: 'pages/article/index?id=' + id,
          success: function (res) {
            // 转发成功
          }
        }
      } else if (types == 2) {
        return {
          title: this.data.list.title,
          path: 'pages/video/video-detail/index?id=' + id,
          success: function (res) {
            // 转发成功
          }
        }
      } else if (types == 3) {
        return {
          title: this.data.title,
          path: 'pages/wd/wd-detail/wd-detail?id=' + id,
          success: function (res) {
            // 转发成功
          }
        }
      } else if (types == 4) {
        return {
          title: this.data.title,
          path: 'pages/pk/detail?id=' + id,
          success: function (res) {
            // 转发成功
          }
        }
      }
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

}))