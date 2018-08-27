const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    type: 1,  //1 点赞  2 评论
    pageend: false,
    list: []
  },

  onLoad(options) {
    var t_type = options.id;
    this.setData({
      type: t_type
    });

    //wx.showLoading({ title: '加载中...' })
    //this._getScrollData()
  },

  onShow() {
    this.setData({
      page: 1,
      list: []
    });
    this._getScrollData()
    wx.removeStorageSync('plfrom')
  },

  onReachBottom() {
    if (this.data.pageend)return;

    this.setData({
      page: ++this.data.page,
    });
    this._getScrollData()
  },

  _getScrollData(page) {
    let params = {
      page: page ? page : this.data.page,
      type: this.data.type
    }

    ajax.myMessage(params).then(res => {
      
      var pageend = res.data.list.length == 0;
      res.data.list = this.data.list.concat(res.data.list);
      var data = Object.assign(res.data, {
        pageend: pageend
      })
      this.setData(data)
      wx.hideToast()
    })
  },


  itemclick(e) {
    var id = e.currentTarget.dataset.link;
    var itemid = e.currentTarget.dataset.vid;
    var types = e.currentTarget.dataset.type;
    var read = e.currentTarget.dataset.read;
    var index = e.currentTarget.dataset.id;

    if (types == 3) {
      this.setData({
        type : 3
      })
      if (read == 0) {
        var lists = this.data.list
        lists[index].is_read = 1
        this.setData({
          list: lists
        })
      }
    }

    //从我的里点进去的（消息标记为已读时调用接口）加参数 from, 标记为已读
    if (this.data.type == 1) {
      wx.setStorageSync('wdfrom', "message-" + itemid);
    } else if (this.data.type == 2) {
      wx.setStorageSync('wdfrom', "message-" + itemid);
    } else if (this.data.type == 3) {
      wx.setStorageSync('plfrom', "message-" + itemid)
    }

    var t_type = this.data.type;
    var url;
    if (t_type==1){
      //点赞
      url = '/pages/wd/wd-hd/wd-hd?id=' + id;
    }else if(t_type ==2){
      //评论
      url = '/pages/wd/wd-hd/wd-hd?id=' + id;
    } else {
      url = '/pages/reply/replyList?id=' + id
    }
    wx.navigateTo({
      url: url
    })
    this.setData({
      type: this.data.type
    })
  },

}))