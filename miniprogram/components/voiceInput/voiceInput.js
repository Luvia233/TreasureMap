Component({
  properties: {
    placeholder: {
      type: String,
      value: '请说话...'
    }
  },

  data: {
    isRecording: false,
    recorderManager: null
  },

  lifetimes: {
    attached() {
      this.initRecorder()
    }
  },

  methods: {
    initRecorder() {
      this.recorderManager = wx.getRecorderManager()

      this.recorderManager.onStart(() => {
        console.log('录音开始')
      })

      this.recorderManager.onStop((res) => {
        console.log('录音结束', res)
        this.setData({ isRecording: false })
        if (res.tempFilePath) {
          this.recognizeVoice(res.tempFilePath)
        }
      })

      this.recorderManager.onError((err) => {
        console.error('录音错误', err)
        this.setData({ isRecording: false })
        wx.showToast({ title: '录音失败', icon: 'none' })
      })
    },

    startRecord() {
      const that = this

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.record']) {
            wx.authorize({
              scope: 'scope.record',
              success() {
                that.doStartRecord()
              },
              fail() {
                wx.showModal({
                  title: '需要授权',
                  content: '请授权使用麦克风功能',
                  confirmText: '去设置',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              }
            })
          } else {
            that.doStartRecord()
          }
        }
      })
    },

    doStartRecord() {
      if (!this.recorderManager) {
        this.initRecorder()
      }

      this.setData({ isRecording: true })

      this.recorderManager.start({
        format: 'mp3',
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000
      })
    },

    stopRecord() {
      if (this.recorderManager && this.data.isRecording) {
        this.recorderManager.stop()
      }
    },

    recognizeVoice(filePath) {
      wx.showLoading({ title: '识别中...' })

      wx.cloud.callFunction({
        name: 'voiceRecognition',
        data: { filePath },
        success: (res) => {
          wx.hideLoading()
          if (res.result && res.result.success && res.result.text) {
            this.triggerEvent('result', { text: res.result.text })
          } else {
            wx.showToast({ title: '识别失败', icon: 'none' })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.error('识别失败', err)
          wx.showToast({ title: '识别失败', icon: 'none' })
        }
      })
    }
  }
})