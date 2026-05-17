App({
  onLaunch() {
    // 小程序启动时，检查用户是否已登录
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      // 未登录，跳转到登录页
      wx.redirectTo({ url: '/pages/login/login' })
    }
  },
  globalData: {
    userInfo: null
  }
})