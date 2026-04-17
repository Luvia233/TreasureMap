App({
  globalData: {
    userInfo: null,
    familyId: null,
    userId: null,
    hasLogin: false
  },

  onLaunch(options) {
    console.log('温馨家居物品定位小程序已启动')
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true,
      })
    }
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userId = wx.getStorageSync('userId')
    const familyId = wx.getStorageSync('familyId')
    
    if (userId && familyId) {
      this.globalData.userId = userId
      this.globalData.familyId = familyId
      this.globalData.hasLogin = true
    } else {
      this.globalData.hasLogin = false
    }
  },

  login(userId, familyId, userInfo) {
    this.globalData.userId = userId
    this.globalData.familyId = familyId
    this.globalData.userInfo = userInfo
    this.globalData.hasLogin = true
    
    wx.setStorageSync('userId', userId)
    wx.setStorageSync('familyId', familyId)
    wx.setStorageSync('userInfo', userInfo)
  },

  logout() {
    this.globalData = {
      userInfo: null,
      familyId: null,
      userId: null,
      hasLogin: false
    }
    
    wx.removeStorageSync('userId')
    wx.removeStorageSync('familyId')
    wx.removeStorageSync('userInfo')
  }
})
