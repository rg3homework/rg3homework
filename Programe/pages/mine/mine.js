Page({
  data: {
    userInfo: {},
    dormInfo: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const dormInfo = wx.getStorageSync('dormInfo') || ''
    this.setData({ userInfo, dormInfo })
  },

  // 设置宿舍信息
  setDorm() {
    wx.showModal({
      title: '设置宿舍',
      editable: true,
      placeholderText: '请输入宿舍号（如：3栋201）',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.setStorageSync('dormInfo', res.content)
          this.setData({ dormInfo: res.content })
          wx.showToast({ title: '设置成功' })
        }
      }
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.redirectTo({ url: '/pages/login/login' })
        }
      }
    })
  }
})