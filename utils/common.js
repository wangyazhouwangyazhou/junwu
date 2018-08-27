/*
* @Author: daibin
* @Date:   2017-08-05 15:41:20
* @Last Modified by:   daibin
* @Last Modified time: 2017-10-11 14:19:45
*/

'use strict';
export default {

  // onShareAppMessage(res) {
  //   // if (res.from === 'button') {
  //   // }
  //   return {
  //     title: this.shareTitle || null,
  //     path: this.sharePath || '/pages/index/index',
  //     success: function(res) {
  //       // 转发成功
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //     }
  //   }
  // },

  onPageSet(page) {
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
    if (page.bottomText) {
      wx.setStorageSync('BaseInfo', page.bottomText)
    }
  },

  onNormalizeScrollData(res, oldList, id) {
    const obj = {}
    if (!res.total || !res.list || res.total === 0) {
      obj['noResult'] = true;
    } else {
      if (res.list.length) {
        if (id) {
          res.list.map(item => {
            if (item[id]) item['id'] = item[id]
          })
        }
        if (res.page > 1) {
          obj['list'] = oldList.concat(res.list);
        } else {
          obj['list'] = res.list
        }
        if (res.page * res.size >= res.total) {
          obj['noMoreData'] = true;
        }
      } else {
        obj['noMoreData'] = true;
      }
    }
    return obj
  },

  onLoadMoreData() {
    if (this.data.noMoreData || this.scrollTimer) return
    this._getScrollData()
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = ''
    }, 200)
  },

  onModalTips(msg = '', cancel = false) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: msg.title || '提示',
        content: msg.msg || msg,
        showCancel: cancel,
        complete: res => {
          resolve(res)
        }
      });
    })
  },

  onTapTemplateItem(event) {
    const id = event.currentTarget.id
    if (this.pageTo) this.pageTo(id)
  },

  onTapRedirectTo(event) {
    const url = event.currentTarget.dataset.url
    const index = url.indexOf(this.route)
    if (index === -1) {
      wx.redirectTo({
        url
      })
    }
  },

  onTapScanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        let result = res.result;
        result = result.replace('http://', '');
        const action = result.split(':');
        const url = '/pages/' + action[0] + '/' + action[1] + '?code=' + action[2];
        wx.navigateTo({
          url: url
        })
      }
    })
  }

}