const app = getApp();
const ajax = app.ajax;

Page({

  data: {
    userAddress: '',
    list: []
  },

  onLoad(options) {
    this.init()
    this.getAddress()
  },

  init() {
    const list = wx.getStorageSync('prizeData');
    if (list && list.length) {
      this.setData({
        list
      })
    } else {
      wx.navigateBack()
    }

  },
  getAddress() {
    const userAddress = wx.getStorageSync('userAddress');

    if (userAddress) {
      this.setData({
        userAddress
      });
    } else {
      wx.chooseAddress({
        success: res => {
          wx.setStorageSync('userAddress',res)
          this.setData({
            userAddress: res
          });
        }
      })
    }
  },

  goToAddress() {
    let userAddress = '';

    wx.getSetting({
      success: res => {
        if (!res['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success: res => {
              wx.chooseAddress({
                success: function (res) {
                  userAddress = res;
                }
              })
            }
          })
        } else {
          wx.chooseAddress({
            success: res => {
               userAddress = res;
            }
          })
        }
      }
    });

    if(userAddress) {
      wx.setStorageSync('userAddress', res)
      this.setData({userAddress});
    }
  },

  getPrize() {
    const adr = this.data.userAddress;
    const addressData = {
      postalcode: adr.postalCode,
      province: adr.provinceName,
      city: adr.cityName,
      county: adr.countyName,
      detail: adr.detailInfo,
      tel: adr.telNumber
    }
    ajax.myAddAddress(addressData).then(res => {
      if (res.code === 0) {
        this._userUpdateLogStatus(res.addressid)
      } else {
        wx.showToast({title: res.error})
      }
    })
  },

  _userUpdateLogStatus(status) {
    const params = {
      lid: this.data.list[0]['lid'],
      pid: this.data.list[0]['pid'],
      status: status
    }
    ajax.userUpdateLogStatus(params).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '领取成功'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    })
  }
})