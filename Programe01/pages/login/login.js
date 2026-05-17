Page({
  data: {
    agreed: false // 默认未勾选
  },

  // 切换勾选状态
  toggleAgree() {
    this.setData({
      agreed: !this.data.agreed
    })
  },

  // 微信一键登录（仅勾选后可执行）
  handleGetUserInfo(e) {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先勾选协议',
        icon: 'none'
      })
      return
    }

    const { userInfo } = e.detail
    if (!userInfo) {
      wx.showToast({ title: '登录失败', icon: 'none' })
      return
    }

    // 保存用户信息到本地存储
    wx.setStorageSync('userInfo', userInfo)
    // 跳转到首页
    wx.switchTab({ url: '/pages/index/index' })
  }
})