const app = getApp();
const ajax = app.ajax;
const types = app.types;

Page( Object.assign({}, app.common, app.searchFn, app.videoFn, app.shareFn,{
  data: {
    loading: true,
    page: 1,
    searchPage: 1,
    tabCurrent: 0,
    placeholder: '搜索',
    searchList: [],
    types: [],
    userInfo: {},
    swipers: [],
    navs: [],
    searchTop:76,
    searchShow: false,
    share_view: false,
    search_view: false,
    openimgBool: false,
    navModel: false,
    new: false, //开屏动画显示规则,
    paddings: 72,
    user: '',
    showTime: '',
    newTime:'',
    time:'',
    swiperNum: 0,
    system: false,
  },

  input(){
    this.setData({
      searchShow: true
    })
  },

  onLoad() {

    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var system = res.system
        var str = system.slice(0, 3)
        if (str == 'iOS') {
          self.setData({
            system: 'true'
          })
        } else {
          self.setData({
            system: 'false'
          })
        }
        self.setData({
          bannerW: res.windowWidth,
          bannerH: res.windowWidth*9/16,
          updateW: (res.windowWidth-40)/3.5,
          updateH: (res.windowWidth-40)/3,
        });
      }
    })

    var isNew = this.data.new;
    var barText = '专题';
    var iconPath = '/images/video/icon-topic.png';
    var selectedIconPath = '/images/video/icon-topic-select.png';

    if(isNew) {
      barText = '节目';
      iconPath = '/images/channel.png';
      selectedIconPath = '/images/channel-selected.png';
    }

    wx.setTabBarItem({
      index: 1,
      text: barText,
      iconPath: iconPath,
      selectedIconPath: selectedIconPath
    })

    this._getScrollData();

  },

  getuser(event) {
    var type = event.currentTarget.dataset.type
    var errMsg = event.detail.errMsg
    var that = this;
    if (errMsg == 'getUserInfo:fail auth deny') {

    } else {
      wx.login({
        success: function (res) {
          let params = {
            // appId: '',
            code: res.code,
            iv: event.detail.iv,
            encryptedData: event.detail.encryptedData
          }
          ajax.userLogin(params, true).then(res => {
            var add = wx.getStorageSync('add')
            wx.setStorageSync('userSession', res.data.userSession);
            wx.setStorageSync('userInfo', res.data.userInfo)
            that.setData({
              is_login: true
            })
            that._getScrollData()
          })
        }
      })
    }
  },

  onShow() {
    var newTime = wx.getStorageSync('time')
    var userInfo = wx.getStorageSync('userInfo')
    var is_login = userInfo ? true : false
    this.setData({
      is_login: is_login,
      newTime: newTime
    })
    this.getMsgFlag()
  },

  left: function (e) {
    this.setData({
      swiperNum: this.data.swiperNum -1
    })
    if (this.data.swiperNum == -1) {
      this.setData({
        swiperNum: 2
      })
    }
  },

  catchtouchmove: function (res) {
    return false
  },

  right: function (e) {
    this.setData({
      swiperNum: this.data.swiperNum + 1
    })
    if (this.data.swiperNum == 3) {
      this.setData({
        swiperNum: 0
      })
    }
  },

  goToPkList : function () {
    wx.navigateTo({
      url: '/pages/pk/index',
    })
  },

  goToPkDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pk/detail?id=' + id,
    })
  },

  support: function (e) {
    var id = e.currentTarget.dataset.id
    var optionid = e.currentTarget.dataset.optionid
    var params = {
      id: id,
      optionid: optionid
    }
    ajax.pksubmit(params).then(res => {
      this.setData({
        support: optionid
      })
    })
  },


  getMsgFlag: function () {

    var params = {
      time: app.data.startTime
    }
    ajax.unreadToast(params).then(res => {
      var zan = res.data.praiseToast == 1 ? true : false;
      var ping = res.data.commentToast == 1 ? true : false;
      var answer = res.data.answerDraftToast =1 ? true : false;
      var vide = res.data.videoToast = 1 ? true : false
      var totalMsg = res.data.totalToast;
      var time = res.data.programTime
      this.setData({
        zan: zan,
        ping: ping,
        answer: answer,
        vide: vide,
        time: time
      });

      if (this.data.newTime > this.data.time) {
        wx.showTabBarRedDot({
          index: 1,
        })
      } else if (this.data.newTime = this.data.time) {
        wx.hideTabBarRedDot({
          index: 1,
        })
      } else {
        wx.hideTabBarRedDot({
          index: 1,
        })
      }

      if (totalMsg == 0) {
        wx.hideTabBarRedDot({
          index: 2,
          text: totalMsg.toString()
        })
      } else {
        wx.setTabBarBadge({
          index: 2,
          text: totalMsg.toString()
        })
      }
      wx.hideToast()
    })
  },

  onPullDownRefresh() {
    var tab = wx.getStorageSync('tabCurrent');

    var tabCurrent = tab.id ? tab.id : 0;
    var type = tab.type ? tab.type : ''

    var navModel = false;
    var questionModel = false;


    if(tabCurrent > 0) {
      navModel = true;
      questionModel = true;
    }

    this.setData({
      tabCurrent: tabCurrent,
      navModel: navModel,
      questionModel: questionModel,
      type: tabCurrent,
      list: [],
      page: 1,
      searchShow: false,
      videoUrl: '',
      paddings: 72
    });

    this._getNavData();
   
    if(type) {
      if(tab.type != 0) {
        this._getNavScrollData();
      } else {
        this.setData({
           navModel: false,
           questionModel: true
        });
        this._getScrollQuestionData();
      }
    } else {
      this._getScrollData();
    }
  },

  onReachBottom() {
    if (this.data.navModel) {this.onLoadNavMoreData()}
    else if (this.data.questionModel) {this.onLoadQuestionMoreData()}
    else this.onLoadMoreData()
  },

  changeTab(event) {
    const id = event.currentTarget.id;
    const type = event.currentTarget.dataset.type;
    this.setData({
       tabCurrent: id,
       navModel: true,
       questionModel: false,
       type: id,
       list: [],
       page: 1,
       videoUrl: ''
    });

    if(type != 0) {
      this._getNavScrollData();
    } else {
      this.setData({
         navModel: false,
         questionModel: true
      });
      this._getScrollQuestionData();
    }

    wx.setStorageSync('tabCurrent', {id:id, type:type});
    
  },

  goToIndex() {
    this.setData({
      tabCurrent: 0,
      list: [],
      navModel: false,
      questionModel: false,
      page: 1,
      videoUrl: ''
    });

    wx.removeStorageSync('tabCurrent');
    this._getScrollData();
  },
  showad(e){
    var appid = e.currentTarget.dataset.appid
    var url = '/' + e.currentTarget.dataset.url
    var resourceId = e.currentTarget.dataset.id
    const params = {
      resourceId: resourceId
    }
    ajax.browse(params).then(res => {})
    wx.navigateToMiniProgram({
        appId:  appid,
        path:  url,
        extarData:  {
            open:  'happy'
        },
        envVersion:  'release',
        success(res)  {
        }
    })  
  },
  playVideo(event) {
    this.goToDetail(event)
    // const top = event.currentTarget.dataset.top;
    // const id = event.currentTarget.id;
    // const list = this.data.list;
    // const toplist = this.data.toplist;
    // const offsetTop = event.currentTarget.offsetTop;
    // var vid = 0;
    // var videoUrl = '';

    // if(top == 1) {
    //   vid = toplist[id]['id'];
    //   videoUrl = toplist[id]['url']
    // } else {
    //   vid = list[id]['id'];
    //   videoUrl = list[id]['url']
    // }
    
    // ajax.getVideoUpdate({vid});

    // this.setData({
    //   videoUrl:videoUrl,
    //   offsetTop: offsetTop
    // })


  },

  _getNavData() {
    const params = {}
    ajax.getIndexNavbar(params).then(res => {
      this.setData({
        navs: res.data
      })
    })
  },

  _getScrollQuestionData(page = this.data.page) {
    let params = {
      page,
    }

    ajax.getWDList(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)

      this.setData({
        list,
        banner:[],
        question:[],
        toplist:[],
        page: ++page,
        noResult,
        noMoreData
      })
      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  onLoadQuestionMoreData(event) {
    if (this.data.loadAllData || this.$timer) return;
    this.$timer = setTimeout(() => {
      this._getScrollQuestionData();
    },300)
  },

  _getNavScrollData(page = this.data.page, type = this.data.type) {
    const params = {
      page,
      navType: this.data.type
    }
    ajax.getIndexNav(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const {list, noResult ,noMoreData} = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        list,
        banner:[],
        question:[],
        toplist:[],
        page: ++page,
        noResult,
        noMoreData,
        total: res.data.total
      })
      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },3000)
    })
  },

  onLoadNavMoreData(event) {
    // if (this.data.loadAllData || this.$timer) return;
    // this.$timer = setTimeout(() => {
      this._getNavScrollData();
    // },300)
  },

  _getScrollData(page = this.data.page) {
    const params = {
      page,
      type: this.data.system
    }
    ajax.getIndex(params).then(res => {
      console.log(res)
      if (res.pageSet) this.onPageSet(res.pageSet)
      res.data.list = this.normalizeVideoData(res.data.list)

      var openimgBool = res.data.openimage ? true : false; //开屏的默认值
      if (openimgBool) {
        var flag1 = wx.getStorageSync("openimg");
        var myDate = new Date();
        var flag2 = myDate.getFullYear() + "" + myDate.getMonth() + "" + myDate.getDate();
        if (flag1 == flag2) {
          openimgBool = false;
        } else {
          openimgBool = true;
          wx.setStorageSync("openimg", flag2);
        }
      }
      

      if(res.data.unreadToast) {
        wx.setTabBarBadge({
          index: 2,
          text: res.data.unreadToast.toString()
        })
      }

      const listdata = this.onNormalizeScrollData(res.data, this.data.list, 'vid')

      setTimeout(function(){
        wx.hideLoading()
      },2000)

      const data = Object.assign(listdata, {
        BaseInfo: wx.getStorageSync('BaseInfo'),
        page: ++page,
        swipers: res.data.banner,
        banner: res.data.banner,
        question: res.data.question,
        toplist: res.data.toplist,
        isAdmin: +res.data.isAdmin,
        isService: +res.data.isService,
        title: res.data.title,
        openimgBool: openimgBool,
        openimage: res.data.openimage,
        loading: false,
        pklist: res.data.pklist.list,
        search: res.data.search
      })
      this.setData(data)
      
      if(res.data.unreadToast > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: res.data.unreadToast.toString()
        })
      }

      var versionCheck = res.data.versionCheck;
      var barText = '专题';
      var iconPath = '/images/video/icon-topic.png';
      var selectedIconPath = '/images/video/icon-topic-select.png';

      if(versionCheck == 0) {
        barText = '节目';
        iconPath = '/images/channel.png';
        selectedIconPath = '/images/channel-selected.png';
      }

      wx.setTabBarItem({
        index: 1,
        text: barText,
        iconPath: iconPath,
        selectedIconPath: selectedIconPath
      })

      this._getNavData();

      setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          paddings: 72
        })
      },2000)
    })
  },

  onTapTemplateItem(event) {
    const id = event.currentTarget.id;
    const url = `/pages/article/index?id=${id}`
    wx.navigateTo({
      url
    })
  },

  onTapTemplateItem2(event) {
    var url = "/"+event.currentTarget.dataset.link;
    wx.navigateTo({
      url
    })
  },

  goToDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video-detail/index?id=' + id
    })
  },

  toQuestion(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/wd/wd-detail/wd-detail?id=' + id,
    })
  },

  onTapSwiper(e) {
    var url = "/"+e.currentTarget.dataset.link
    if (!url) return
    wx.navigateTo({
      url
    })
  },

  palyVideoOnce(vid) {
    ajax.getVideoUpdate({vid})
  },

  onShareAppMessage() {
    var self = this;

    return {
      title: this.data.shareTitle || null,
      path: this.data.sharePath || this.route,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      },
      complete:function(){
        self.setData({
          shareTitle: "",
          sharePath: ""
        });
      }
    }
  },

  //点赞
  onTapPraise(event) {
    var eledata = event.currentTarget.dataset;
    if (eledata.state != 0) {
      wx.showToast({
        title: '您已点赞',
        icon: 'success',
        duration: 1200
      })
      return;//只能点赞，不能取消
    }
    var formId = event.detail.formId;
    const action = eledata.state == 0 ? 'add' : 'del'
    const params = {
      articleId: eledata.id,
      action: action,
      formId: formId
    }

    ajax.getPraise(params).then(res => {
      //ok
      for (var i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].id == eledata.id) {
          this.data.list[i].is_praise = eledata.state == 0 ? 1 : 0;
          if (eledata.state == 0) {
            this.data.list[i].praise_count = this.data.list[i].praise_count + 1
          } else {
            this.data.list[i].praise_count = this.data.list[i].praise_count - 1
          }

        }
      }
      this.setData({
        list: this.data.list
      });

      wx.showToast({
        title: "您已点赞",
        icon: 'success',
        duration: 1200
      })
    })
  },


  //收藏
  onTapMark(event) {
    var formId = event.detail.formId;
    var eledata = event.currentTarget.dataset;
    const action = eledata.state == 0 ? 'add' : 'del'
    const params = {
      articleId: eledata.id,
      action: action,
      formId:formId
    }

    ajax.getMark(params).then(res => {
      //ok
      for (var i = 0; i < this.data.list.length;i++){
        if (this.data.list[i].id == eledata.id){
          this.data.list[i].is_favorite = eledata.state == 0 ? 1 : 0;
        }
      }
      this.setData({
        list: this.data.list
      });

      wx.showToast({
        title: action == 'add' ? "已收藏" : "已取消收藏",
        icon: 'success',
        duration: 1500
      })
    })
  },

  //问答列表
  wdlistclick:function() {
    wx.navigateTo({
      url: '/pages/wd/wd'
    })
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  //问答详情
  wdclick:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wd/wd-detail/wd-detail?id=' + id
    })
  },

  linkOpenimg:function(e) {
    var link = "/"+e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    });
    this.closeOpenimg();
  },
  closeOpenimg: function () {
    this.setData({
      openimgBool: false
    });
  },

  //分享
  onTapShare(event) {
    var eledata = event.currentTarget.dataset;
    var id = eledata.id;
    var cover = eledata.cover;
    var title = eledata.title;
    var message = eledata.message;
    var duration = eledata.duration;

    let params = {
      resourceId: id,
      type: 1
    }

    ajax.shareUpdate(params).then(res => {})
    
    this.setData({
      share_view: true,
      cover: cover,
      shareCover: cover,
      shareTitle: title,
      shareDesc: message,
      shareTime: duration,
      shareId: id,
      sharePath: 'pages/video/video-detail/index?id=' + id
    });
  },

}))
