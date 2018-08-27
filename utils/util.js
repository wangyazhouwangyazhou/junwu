import parm from 'parm.js'
const CHECK_USERSESSION = false
// 获取用户信息
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    // 微信登录
    wx.login({
      // success: res => {
      //   const code = res.code;
      //   // 微信获取用户授权信息
      //   wx.getUserInfo({
      //     complete: res => {
      //       let params = {
      //         appId: parm.appId,
      //         wxappId: parm.wxappId,
      //         code: code,
      //       }
      //       if (res.encryptedData && res.iv && res.rawData && res.signature) { // 用户同意授权
      //         params = Object.assign({}, params, {
      //           iv: res.iv,
      //           encryptedData: res.encryptedData,
      //           rawData: res.rawData,
      //           signature: res.signature,
      //         })
      //       }
      //       wx.request({
      //         url: parm.userLogin,
      //         data: params,
      //         method: 'POST',
      //         header: {
      //           'Content-Type': 'application/x-www-form-urlencoded'
      //         },
      //         success: _res => {
      //           if (_res.data.code === 0) {
      //             if (CHECK_USERSESSION) { // 校验用户信息
      //               checkUserSession(_res.data).then(checkResult => {
      //                 if (!checkResult) { // 信息过时 重新登录
      //                   getUserInfo()
      //                 } else { // 存储用户信息 并返回用户信息
      //                   wx.setStorageSync('userSession', _res.data.userSession)
      //                   wx.setStorageSync('userInfo', _res.data.userInfo)
      //                   resolve(_res.data)
      //                 }
      //               })
      //             } else { // 不校验用户信息
      //               wx.setStorageSync('userSession', _res.data.userSession);
      //               wx.setStorageSync('userInfo', _res.data.userInfo);
      //               resolve(_res.data)
      //             }
      //           } else {
      //             wx.showModal({
      //               title: '提示',
      //               content: _res.data.msg || _res.data.error || '登录信息错误',
      //               showCancel: false
      //             })
      //           }
      //         }
      //       })
      //     },
      //   })
      // }
    })
  })
}

// 校验用户信息
const checkUserSession = (_sesson) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: parm.userCheck,
      data: {
        skey: _sesson.userSession,
        uid: _sesson.userInfo.uid,
        app_id: parm.appId
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: res => {
        if (res.data.code == '403') {
          wx.removeStorageSync('userSession')
          wx.removeStorageSync('userInfo')
          resolve(false)
        } else if (res.data.code == '400') {
          wx.showModal({
            title: '错误提示',
            content: '应用不存在',
            showCancel: false
          })
          resolve(false)
        } else {
          resolve(true)
        }
      }
    });
  })
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


export default {
  getUserInfo,
  formatTime,
}