Page({
  data: {
    rules: [],
    userInfo: {}
  },

  onLoad() {
    // 读取用户信息（从登录页保存的本地存储里拿）
    const userInfo = wx.getStorageSync('userInfo') || {}
    const rules = wx.getStorageSync('rules') || []
    this.setData({ rules, userInfo })
  },

  // 新建公约
  addRule() {
    wx.showModal({
      title: '新建寝室公约',
      editable: true,
      placeholderText: '请输入公约内容（如：晚上11点后保持安静）',
      success: (res) => {
        if (res.confirm && res.content) {
          const now = new Date()
          const newRule = {
            id: Date.now(),
            time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
            author: this.data.userInfo.nickName || '匿名用户',
            content: res.content
          }
          const rules = [...this.data.rules, newRule]
          wx.setStorageSync('rules', rules)
          this.setData({ rules })
          wx.showToast({ title: '添加成功' })
        }
      }
    })
  },

  // 删除公约
  deleteRule(e) {
    const ruleId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除这条公约吗？',
      success: (res) => {
        if (res.confirm) {
          const rules = this.data.rules.filter(item => item.id !== ruleId)
          wx.setStorageSync('rules', rules)
          this.setData({ rules })
          wx.showToast({ title: '删除成功' })
        }
      }
    })
  },

  // 返回首页
  goBack() {
    wx.navigateBack()
  }
})