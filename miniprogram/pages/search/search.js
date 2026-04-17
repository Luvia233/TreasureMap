const app = getApp()

Page({
  data: {
    keyword: '',
    results: [],
    hasSearched: false,
    isLoading: false,
    hotSpaces: ['客厅', '卧室', '厨房', '书房', '卫生间'],
    categories: ['工具', '证件', '药品', '电子产品', '衣物', '书籍', '游戏'],
    filterSpace: ''
  },

  onLoad(options) {
    if (options.space) {
      const space = decodeURIComponent(options.space)
      this.setData({ keyword: space, filterSpace: space })
      this.doSearch(space)
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    if (!this.data.keyword.trim()) return
    this.doSearch(this.data.keyword.trim())
  },

  onTagTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch(keyword)
  },

  onClear() {
    this.setData({ keyword: '', results: [], hasSearched: false })
  },

  onVoiceSearch() {
    wx.showToast({ title: '语音功能开发中', icon: 'none' })
  },

  doSearch(keyword) {
    this.setData({ isLoading: true, hasSearched: true })

    wx.cloud.callFunction({
      name: 'searchItems',
      data: { keyword },
      success: (res) => {
        if (res.result.success) {
          this.setData({ results: res.result.data })
        }
      },
      fail: (err) => {
        console.error('搜索失败', err)
        wx.showToast({ title: '搜索失败', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }
})
