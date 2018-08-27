// template/share/index.js
export default {
  closeSharePanel() {
    this.setData({
      share_view:false
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

  downCover:function(){
    var self = this;
    wx.downloadFile({
      url: this.data.shareCover,
      success: function (res) {
        var cover = res.tempFilePath
        wx.showLoading({ title: '生成中.' })
        self.downQRCode(cover)
      }
    })
  },

  downQRCode: function (_cover) {
    var self = this;
    var page = 'pages/video/video-detail/index';
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
    var path = "/images/shareVideo.png";
    var jpath = "/images/jVideo.png";
    var path2 = _cover;
    var path3 = _qrcode;

    var ctx = wx.createCanvasContext('myCanvas')
    var width = 750
    var height = 1334

    //绘制二维码
    var x3 = 300
    var y3 = 888
    var w3 = 144
    var h3 = 144
    ctx.drawImage(path3, x3, y3, w3, h3)

    //绘制背景

    ctx.drawImage(path, 0, 0, width, height)

    //绘制cover
    var x2 = 70
    var y2 = 160
    var w2 = 620
    var h2 = 368
    ctx.drawImage(path2, x2, y2, w2, h2)
    
    var x4 = 270
    var y4 = 35
    var w4 = 199
    var h4 = 144
    ctx.drawImage(jpath, x4, y4, w4, h4)

    ctx.setFontSize(36)
    ctx.setTextAlign('left')
    var txt1_x = 104
    var txt1_y = 598
    this.drawTxt(ctx, this.data.shareTitle, txt1_x, txt1_y, 14, 45, 2)

    ctx.setFontSize(28)
    ctx.setTextAlign('center')
    var txt2_x = 345
    var txt2_y = 688
    this.drawTxt(ctx, '时长：' + this.data.shareTime, txt2_x, txt2_y)

    ctx.setFontSize(30)
    ctx.setTextAlign('left')
    var txt3_x = 104
    var txt3_y = 740
    this.drawTxt(ctx, this.data.shareDesc, txt3_x, txt3_y, 17, 40, 4)
  
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
  drawTxt: function (ctx, _str, _x, _y, _total, _lineh, _linenum) {
    if (_str=="" || _str==undefined){
      return;
    }
    var total = _total ? _total : 15; //每行字数（数字算半个）
    var lineH = _lineh ? _lineh : 20; //行间距
    var lineNum = _linenum ? _linenum : 4; //最大显示行数

    /*
    拆解字符串到数组，按行，每行15个（判断数字占半个，其他占1个）
    */
    var lineArray = [];
    var len=0; //数字算半个，中文算一个
    for (var i = 0; i < _str.length; i++){
      var line='';
      if (Math.ceil(len)  % total==0){
        if (lineArray[lineArray.length-1]!=""){
          lineArray.push("");
        }
      }
      var index = Math.floor(len/total); //
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
}