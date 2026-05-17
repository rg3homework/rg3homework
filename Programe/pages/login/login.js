Page({
  handleGetUserInfo(e) {
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