/*
* @Author: daibin
* @Date:   2017-08-26 19:09:24
* @Last Modified by:   daibin
* @Last Modified time: 2017-09-25 10:52:39
*/
export default {
  getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
      let a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      }
      else {
        len += 1;
      }
    }
    return len;
  },
  normalizeVideoData(list) {
    list && list.map(res => {
      if(res.message) {
        const aLen = this.getByteLen(res.message)
        if (aLen > 104 && res.url) {
          res['flod'] = 1
        }
      }
    })
    return list
  },

  onTapExtendText(event) {
    const index = event.currentTarget.dataset.index
    const list = this.data.list
    list[index]['flod'] = list[index]['flod'] ? 0 : 1
    this.setData({
      list
    })
  },

  onTapVideoPlay(event) {
    const vid = event.currentTarget.id
    const top = event.currentTarget.offsetTop
    const url = event.currentTarget.dataset.url
    this.setData({
      videoUrl: url,
      videoOffsetTop: top + 15,
    })
    this.palyVideoOnce && this.palyVideoOnce(vid)
  },

  onTapVideoDetail(event) {
    const id = event.currentTarget.id
    this.pageTo && this.pageTo(id)
  }
}