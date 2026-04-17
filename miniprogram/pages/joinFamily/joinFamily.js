const app = getApp()

Page({
  data: {
    inviteCode: '',
    nickname: '',
    isLoading: false
  },

  onInviteCodeInput(e) {
    this.setData({ inviteCode: e.detail.value.toUpperCase() })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onJoinFamily() {
    if (!this.data.inviteCode.trim()) {
      wx.showToast({ title: '请输入邀请码', icon: 'none' })
      return
    }

    if (!this.data.nickname.trim()) {
      wx.showToast({ title: '请输入您的称呼', icon: 'none' })
      return
    }

    if (this.data.isLoading) return

    this.setData({ isLoading: true })

    wx.cloud.callFunction({
      name: 'joinFamily',
      data: {
        inviteCode: this.data.inviteCode.trim(),
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
            title: '加入成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' })
              }, 1500)
            }
          })
        } else {
          wx.showToast({ title: res.result.error || '加入失败', icon: 'none' })
        }
      },
      fail: (err) => {
        console.error('加入家庭失败', err)
        wx.showToast({ title: '加入失败，请重试', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  },

  onCreateFamily() {
    wx.navigateTo({ url: '/pages/createFamily/createFamily' })
  }
})
