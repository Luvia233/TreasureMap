const app = getApp()

Page({
  data: {
    keyword: '',
    results: [],
    hasSearched: false,
    isLoading: false,
    hotSpaces: ['客厅', '卧室', '厨房', '书房', '卫生间'],
    categories: ['工具', '证件', '药品', '电子产品', '衣物', '书籍', '游戏'],
    filterSpace: '',
    page: 1,
    pageSize: 20,
    hasMore: false,
    isLoadingMore: false
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
    this.setData({ page: 1, results: [] })
    this.doSearch(this.data.keyword.trim())
  },

  onTagTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword, page: 1, results: [] })
    this.doSearch(keyword)
  },

  onClear() {
    this.setData({
      keyword: '',
      results: [],
      hasSearched: false,
      page: 1,
      hasMore: false
    })
  },

  onVoiceSearch() {
    wx.showToast({ title: '语音功能开发中', icon: 'none' })
  },

  doSearch(keyword) {
    this.setData({ isLoading: true, hasSearched: true })

    wx.cloud.callFunction({
      name: 'searchItems',
      data: {
        keyword,
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.result.success) {
          const newResults = res.result.data
          this.setData({
            results: newResults,
            hasMore: newResults.length >= this.data.pageSize
          })
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

  onLoadMore() {
    if (this.data.isLoadingMore || !this.data.hasMore) return

    this.setData({
      isLoadingMore: true,
      page: this.data.page + 1
    })

    wx.cloud.callFunction({
      name: 'searchItems',
      data: {
        keyword: this.data.keyword,
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.result.success) {
          const newResults = res.result.data
          this.setData({
            results: [...this.data.results, ...newResults],
            hasMore: newResults.length >= this.data.pageSize
          })
        }
      },
      fail: (err) => {
        console.error('加载更多失败', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoadingMore: false })
      }
    })
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }
})