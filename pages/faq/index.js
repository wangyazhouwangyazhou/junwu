const {ajax, util, common} = getApp()

Page(Object.assign({}, common, {
  data: {},

  onLoad(option) {

  },

  onShow() {
    this._getData();
  },

  _getData() {
    const params = {}
    ajax.faqList(params).then(res => {
      this.setData({
        list: res.data
      })
    })
  },

  change(event) {
    const id = event.currentTarget.id;
    const hidden = event.currentTarget.dataset.hidden;
    const list = this.data.list;

    for (var i = 0; i < list.length; i++) {
      if(i == id) {
        list[i]['hidden'] = 0;
      } else {
        list[i]['hidden'] = 1;
      }
    }

    this.setData({
      list:list
    })
  }

}))
