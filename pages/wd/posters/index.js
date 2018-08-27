const app = getApp()
const ajax = app.ajax
const util = app.util
Page(Object.assign({}, app.common, app.shareArticleFn, {
  /**
   * 页面的初始数据
   */
  data: {
    contentList: [],
    codeurl:'',
    list:{},
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
  var id = options.id
  var contentList = wx.getStorageSync('contentList')
  var userInfo = wx.getStorageSync('userInfo')
  this.setData({
    contentList: contentList,
    userInfo: userInfo,
  })
  var params = {
    page: this.data.page,
    questionId: id
  }
  ajax.getWDInfo(params).then(res => {
    this.setData({
      cover: res.data.cover,
      list: res.data.list,
      title: res.data.title,
      contentList: contentList,
      answerId: id
    });
  })
},

sharewxquan(e) {
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
  },

  downCover: function () {
    var self = this;
    wx.downloadFile({
      url: self.data.cover,
      success: function (res) {
        var cover = res.tempFilePath
        wx.showLoading({ title: '生成中.' })
        self.avatar(cover)
      },
      fail: function(res) {
      }        
    })
  },

  avatar: function (_cover) {
    var self = this;
    wx.downloadFile({
      url: self.data.userInfo.avatar,
      success: function (res) {
        var cover2 = res.tempFilePath
        wx.showLoading({ title: '生成中.' })
        self.downQRCode(_cover, cover2)
      },
    })
  },

  downQRCode: function (_cover, _cover2) {
    this.setData({
      page: 'pages/wd/wd-detail/wd-detail'
    })
    var self = this;
    var page = self.data.page;
    var scene = self.data.answerId
    const app = getApp();
    var appid = app.apiUrl.appId;
    var codeurl = 'https://jw.feeyan.com/app/fyyingxiao/api/share/getwxacode?appId=' + appid + '&scene=' + scene + '&page=' + page;
    wx.downloadFile({
      url: codeurl,
      success: function (res) {
        var qrcoder = res.tempFilePath
        wx.showLoading({ title: '生成中..' })
        self.drawAll(_cover, _cover2, qrcoder);
      }
    })
  },

  drawAll: function (_cover, _qrcode, _cover2) {
    var path = "/images/poster-top.png";
    var path2 = _cover;
    var path3 = _qrcode;
    var path4 = _cover2;
    var ctx = wx.createCanvasContext('myCanvas')
    var width = 750
    var height = this.data.Chief
    
    var x3 = 47
    var y3 = 475
    var w3 = 100
    var h3 = 100
    ctx.drawImage(path3, x3, y3, w3, h3)

    //绘制背景
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, width, height)
    
    //绘制cover
    var x2 = 7
    var y2 = 10
    var w2 = 735
    var h2 = 436
    ctx.drawImage(path2, x2, y2, w2, h2)

    // 绘制题目
    ctx.setFontSize(50)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#000000')
    var txt4_x = 60
    var txt4_y = 530
    this.drawTxt(ctx, this.data.title, txt4_x, txt4_y, 12, 50, 2)

    // 绘制线 图片
    var x2 = 40
    var y2 = 630
    var w2 = 644
    var h2 = 50
    ctx.drawImage(path, x2, y2, w2, h2)

    //  绘制头像
    var x2 = 40
    var y2 = 730 
    var w2 = 68
    var h2 = 68
    ctx.drawImage(path3, x2, y2, w2, h2)


    ctx.setFontSize(36)
    ctx.setTextAlign('left')
    var txt1_x = 140
    var txt1_y = 760
    this.drawTxt(ctx, this.data.userInfo.username, txt1_x, txt1_y, 14, 45, 2)


    this.setData({
      act: '在军武小程序参与这个问答'
    })

    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#868686')
    var txt3_x = 140
    var txt3_y = 800
    this.drawTxt(ctx, this.data.act, txt3_x, txt3_y, 14, 45, 2)

    this.setData({
      txt3_y: txt3_y
    })

    var contentList = this.data.contentList
    for (let arr of contentList) {
      if (arr.type == 'txt') {
        ctx.setFontSize(30)
        var nextDivHeight = parseInt((arr.length / 22 ) * 40)
        var txt3_x = 40
        var txt3_y = this.data.txt3_y + 100
        this.drawTxt(ctx, arr.content, txt3_x, txt3_y, 22, 45, ctx, parseInt(arr.length / 20 + 1))
        this.setData({
          txt3_y: txt3_y + nextDivHeight
        })
      } else {
        if (arr.width > 750) {
          var x4 = 0
          var y4 = this.data.txt3_y + 100
          var bili = 750 / arr.width
          var w4 = parseInt(arr.width * bili)
          var h4 = parseInt(arr.height * bili)
          ctx.drawImage(arr.tempFilePaths, x4, y4, w4, h4)
        } else {
          var x4 = 0
          var y4 = this.data.txt3_y + 50
          var w4 = arr.width
          var h4 = arr.height
          ctx.drawImage(arr.tempFilePaths, x4, y4, w4, h4)
        }

        this.setData({
          txt3_y: this.data.txt3_y + h4 + 100
        })
      }
    }

    // // //绘制二维码
    var x6 = 315
    var y6 = this.data.Chief - 250
    var w6 = 120
    var h6 = 120
    ctx.drawImage(path4, x6, y6, w6, h6)

    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#868686')
    var txt5_x = 290
    var txt5_y = this.data.Chief - 60
    this.drawTxt(ctx, '长按小程序码围观', txt5_x, txt5_y, 14, 45, 2)

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
        wx.previewImage({
          urls: [res.tempFilePath]
        })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var length = []
    for (var i = 0; i < this.data.contentList.length; i++) {
      if (!!this.data.contentList[i].length) {
        length.push(parseInt(this.data.contentList[i].length / 20 * 40))
      } else {
        if (this.data.contentList[i].height > 750) {
          var width = this.data.contentList[i].width
          var bili = 750 / width
          length.push(parseInt(this.data.contentList[i].height * bili))
        } else {
          length.push(parseInt(this.data.contentList[i].height))
        }
      }
      this.setData({
        chiefLength: length,
      })
    };

    var Chief = 0
    var length = this.data.chiefLength
    for (var aa in length) {
      Chief += length[aa]
      this.setData({
        Chief: Chief + 900 + (this.data.contentList.length * 100) 
      })
    }
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
    return {
      title: this.data.title,
      path: 'pages/wd/posters/index?id=' + this.data.answerId
    }
  }
}))