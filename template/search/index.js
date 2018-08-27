export default {
  onTapSearchBox() {
    this.setData({
      searchModel: true,
      search_view: true,
      videoUrl:"",
    })
  },

  onUnload() {
    this.onTapCancelSearch()
  },

  onTapCancelSearch() {
    this.searchKeyWords = null
    this.setData({
      searchList: [],
      videoUrl:"",
      searchModel: false,
      search_view: false,
      noSearchResult: false,
      noMoreSearchData: false,
    })
  },

  onInput(e) {
    if (this.timer) clearTimeout(this.timer)
    let input = e.detail.value.replace(/^\s+|\s+$/g,"")
    if (input != '' ) {
      this.searchKeyWords = input
      this.timer = setTimeout(() => {
        this._getSearch(input,1)
      }, 200)
    } else {
      this.setData({
        videoUrl:"",
        searchList: [],
        noSearchResult: false,
      })
    }
  },

  onLoadMoreSearch() {
    if (this.scrollSearchTimer || this.data.noMoreSearchData) return
    this._getSearch()
    this.scrollSearchTimer = setTimeout(() => {
      clearTimeout(this.scrollSearchTimer)
      this.scrollSearchTimer = null
    }, 200)
  }

}