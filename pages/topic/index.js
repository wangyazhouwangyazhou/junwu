const app = getApp();
const ajax = app.ajax;

Page(Object.assign({}, app.common, {

  data: {
    page: 1,
    types:[],
    loading: true,
    new: true,
    tabCurrent: 0,
    offsetTop: '',
    video: false,
    videoUrl: ''
  },

  onLoad(options) {
    this._getData();
    wx.setStorageSync('time', Date.parse(new Date()) / 1000)
    var params = {
      time: app.data.startTime
    }
    ajax.unreadToast(params).then(res => {
      this.setData({
        programTime: res.data.programTime
      })
      wx.hideTabBarRedDot({
        index: 1,
      })
      wx.setStorageSync('time', this.data.programTime)
    })
  },

  onShow() {
    wx.hideTabBarRedDot({
      index: 1,
    })
  },

  onPullDownRefresh() {
    this.setData({
      tabCurrent: 0
    });
    this._getData()
  },

  changeTab(event, videoSelectTid = '') {

    var id = event.currentTarget.id;
    var tid = event.currentTarget.dataset.tid;

    this.setData({
      tabCurrent: id,
      current:0
    });
   
    const params = {
      typeId: tid
    }

    ajax.programData(params).then(res => {
      this.setData({
        videoList: res.data
      })
    });
  },
  onReachBottom: function () {
    this.onLoadMoreData()
  },

  _getScrollData: function () {

    let params = {
      page: this.data.page + 1,
    }
    ajax.getVideoData(params).then(res => {
      if (res.pageSet) this.onPageSet(res.pageSet)
      const { list, noResult, noMoreData } = this.onNormalizeScrollData(res.data, this.data.list)
      this.setData({
        total: res.data.total,
        page: ++this.data.page,
        list,
        noResult,
        noMoreData
      })
    })
  },

  getSpecialIndex() {
    ajax.getSpecialIndex().then(res => {
      this.setData({
        reviewList: res.data.list
      })
    })
  },

  _getData() {
    ajax.programList().then(res => {
      this.setData({
        bannerList: res.data.banner,
        typeList: res.data.type,
        videoList: res.data.publishedList,
        orderList: res.data.unpublishedList,
        // topList: res.data.specialList.images,
        // tname: res.data.specialList.special,
        versionCheck: res.data.versionCheck,
        list: res.data.list,
        bottomList: res.data.bottomList,
        topList: res.data.topList,
        handpickList: res.data.handpickList
      })

      setTimeout(() => {
        wx.stopPullDownRefresh();
      },2000)

      var isNew = res.data.versionCheck;
      var barText = '专题';
      var iconPath = '/images/video/icon-topic.png';
      var selectedIconPath = '/images/video/icon-topic-select.png';

      if(isNew == 0) {
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

      if(res.data.versionCheck == 1) {
        this.getSpecialIndex();
      }
    })
  },

  subscribeSubmit(event) {
    var pid = event.currentTarget.dataset.pid;
    var status = event.currentTarget.dataset.status;
    var key =  event.currentTarget.dataset.key;
    var formId = event.detail.formId;
    var id = event.currentTarget.id;

    var orderList = this.data.orderList;

    const params = {
      programId: pid,
      formId:formId,
      status: status
    }

    ajax.programSubscribe(params).then(res => {
      
      wx.showToast({
        title: status == 1 ? '已取消预约' : '预约成功，上线后会通知您哦',
        icon: 'none',
        duration: 2000
      })

      orderList[id][key]['is_subscribe'] = status == 1 ? 0 : 1;

      this.setData({
        orderList
      });      

      setTimeout(() => {
        wx.stopPullDownRefresh();
      },2000)
    })
  },

  tapClick(e){
    var sid = e.currentTarget.dataset.sid;
    var id = e.currentTarget.id;
    this.setData({
      page: 1,
      typeId: sid,
      selectKey: id
    });
    this._getScrollData();
  },

  pageTo(id) {
    wx.navigateTo({
      url: '/pages/topic/topic-list/index?id=' + id
    })
  },

  goToDetail(event) {
    const id = event.currentTarget.dataset.id;
    const list = this.data.videoList;
    // const url = list[id]['link'];

    wx.navigateTo({
      url: `/pages/video/video-detail/index?id=${id}`
    })
  },
  playVideo(e) {
    var index = e.currentTarget.id
    var videoUrl = this.data.list[index].url
    this.setData({
      offsetTop: e.currentTarget.offsetTop,
      video: true,
      videoUrl : videoUrl
    })
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/index?type=program'
    })
  },

  lookmore() {
    wx.navigateTo({
      url: '/pages/topic/list',
    })
  },

  more(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/album/index?id=${id}`
    })
  }

}))