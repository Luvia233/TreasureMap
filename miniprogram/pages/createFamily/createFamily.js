const app = getApp()

Page({
  data: {
    familyName: '',
    nickname: '',
    isLoading: false
  },

  onFamilyNameInput(e) {
    this.setData({ familyName: e.detail.value })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onCreateFamily() {
    if (!this.data.familyName.trim()) {
      wx.showToast({ title: '请输入家庭名称', icon: 'none' })
      return
    }

    if (!this.data.nickname.trim()) {
      wx.showToast({ title: '请输入您的称呼', icon: 'none' })
      return
    }

    if (this.data.isLoading) return

    this.setData({ isLoading: true })

    wx.cloud.callFunction({
      name: 'createFamily',
      data: {
        familyName: this.data.familyName.trim(),
        nickname: this.data.nickname.trim()
      },
      success: (res) => {
        if (res.result.success) {
          const { familyId, userId } = res.result.data

          app.globalData.familyId = familyId
          app.globalData.userId = userId
          app.globalData.hasLogin = true

          wx.setStorageSync('familyId', familyId)
          wx.setStorageSync('userId', userId)

          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' })
              }, 1500)
            }
          })
        } else {
          wx.showToast({ title: res.result.error || '创建失败', icon: 'none' })
        }
      },
      fail: (err) => {
        console.error('创建家庭失败', err)
        wx.showToast({ title: '创建失败，请重试', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  }
})
