var aldstat = require("./utils/ald-stat.js");
var push = require('./utils/pushsdk.js');

import apiUrl from './utils/parm.js'
import ajax from './utils/api.js'
import util from './utils/util.js'
import common from './utils/common.js'
import videoFn from './template/video/index.js'
import searchFn from './template/search/index.js'
import shareFn from './template/share/index.js'
import shareWDFn from './template/sharewd/sharewd.js'
import shareArticleFn from './template/shareArticle/index.js'

const types = {

}

//app.js
App({
  util,
  apiUrl,
  ajax,
  types,
  common,
  videoFn,
  searchFn,
  shareFn,
  shareWDFn,
  shareArticleFn,

  data:{
    startTime : Date.parse(new Date()) / 1000
  },

  onLaunch() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('moblie', res)
      }
    })
    wx.setStorageSync('time', this.data.startTime)
  },

  onShow(e) {
    if (!!e.referrerInfo) {
      var path = e.path,
        query = JSON.stringify(e.query),
        scene = e.scene,
        appId = apiUrl.appId,
        userSession = wx.getStorageSync('userSession'),
        extraData = e.referrerInfo.extraData,
        wxappId = e.referrerInfo.appId
      const params = {
        path: path,
        query: query,
        scene: scene,
        extraData: extraData,
        wxappId: wxappId,
        appId: appId,
        userSession: userSession
      }
      ajax.launch(params).then(res => { })
    } else {
      var path = e.path,
        query = JSON.stringify(e.query),
        scene = e.scene,
        appId = apiUrl.appId,
        userSession = wx.getStorageSync('userSession'),
        extraData = '',
        wxappId = ''
      const params = {
        path: path,
        query: query,
        scene: scene,
        extraData: 'extraData',
        wxappId: wxappId,
        appId: appId,
        userSession: userSession
      }
      ajax.launch(params).then(res => { })
    }
  },

  pageSet(page) {
    if (page.title) {
      wx.setNavigationBarTitle({
        title: page.title
      })
    }
    if (page.barBgColor) {
      wx.setNavigationBarColor({
        frontColor: page.barTextColor || '#ffffff',
        backgroundColor: page.barBgColor,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },

})