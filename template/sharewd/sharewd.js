// template/share/index.js
export default {
  closeSharePanel() {
    this.setData({
      share_view: false
    });
  },

  //分享微信朋友圈
  sharewxquan() {
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
      url: this.data.cover,
      success: function (res) {
        var cover = res.tempFilePath
        wx.showLoading({ title: '生成中.' })
        self.downQRCode(cover)
      }
    })
  },

  downQRCode: function (_cover) {
    var self = this;
    var page = 'pages/wd/wd-detail/wd-detail';
    var scene = this.data.shareId;
    const app = getApp();
    var appid = app.apiUrl.appId;
    var codeurl = 'https://wxapp.feeyan.com/app/fyyingxiao/api/share/getwxacode?appId=' + appid + '&scene=' + scene + '&page=' + page;
    wx.downloadFile({
      url: codeurl,
      success: function (res) {
        var qrcoder = res.tempFilePath
        wx.showLoading({ title: '生成中..' })
        self.drawAll(_cover, qrcoder);
      }
    })
  },

  drawAll: function (_cover, _qrcode) {
    var path = "/images/share-hb2.jpg";
    var path2 = _cover;
    var path3 = _qrcode;

    var ctx = wx.createCanvasContext('myCanvas')
    var CHiW = 375
    var CHiH = 555

    //绘制背景
    ctx.drawImage(path, 0, 0, this.data.width, this.data.height)
    //绘制cover
    var x2 = 35 / CHiW * this.data.width
    var y2 = 84 / CHiH * this.data.height
    var w2 = 305 / CHiW * this.data.width
    var h2 = 144 / CHiH * this.data.height
    ctx.drawImage(path2, x2, y2, w2, h2)
    //绘制二维码
    var x3 = 62 / CHiW * this.data.width
    var y3 = 330 / CHiH * this.data.height
    var w3 = 95 / CHiW * this.data.width
    var h3 = w3
    ctx.drawImage(path3, x3, y3, w3, h3)

    ctx.setFontSize(20)
    ctx.setTextAlign('center')
    var txt1_y = 260 / CHiH * this.data.height
    this.drawTxt(ctx, this.data.shareTitle, this.data.width / 2, txt1_y)

    ctx.draw()

    wx.showLoading({ title: '生成中...' })
    var self = this;
    setTimeout(function () {
      wx.showLoading({ title: '生成中....' })
      self.previewHB();
    }, 1000);

  },

  previewHB: function () {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.previewImage({
          urls: [res.tempFilePath]
        })
      },
      complete: function (e) {
        wx.hideLoading()
      }
    })
  },

  //换行
  drawTxt: function (ctx, _str, _x, _y) {
    if (_str == "" || _str == undefined) {
      return;
    }
    var total = 12; //每行字数（数字算半个）
    var lineH = 20; //行间距
    var lineNum = 1; //最大显示行数

    /*
    拆解字符串到数组，按行，每行15个（判断数字占半个，其他占1个）
    */
    var lineArray = [];
    var len = 0; //数字算半个，中文算一个
    for (var i = 0; i < _str.length; i++) {
      var line = '';
      if (Math.ceil(len) % total == 0) {
        lineArray.push("");
      }
      lineArray[lineArray.length - 1] = lineArray[lineArray.length - 1] + _str[i];

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
}