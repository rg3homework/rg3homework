Page({
  data: {
    monthTotal: 0,
    toSplit: 0,
    bills: []
  },

  onLoad() {
    this.loadBills()
    this.calculateOverview()
  },

  // 加载账单
  loadBills() {
    const bills = wx.getStorageSync('bills') || []
    this.setData({ bills })
  },

  // 计算本月支出和待分摊
  calculateOverview() {
    const bills = this.data.bills
    const now = new Date()
    const monthBills = bills.filter(item => {
      const billDate = new Date(item.date)
      return billDate.getFullYear() === now.getFullYear() && billDate.getMonth() === now.getMonth()
    })
    const monthTotal = monthBills.reduce((sum, item) => sum + Number(item.amount), 0)
    // 假设待分摊是所有账单（可按需求修改）
    const toSplit = monthTotal
    this.setData({ monthTotal, toSplit })
  },

  // 记一笔（弹窗添加）
  addBill() {
    wx.showModal({
      title: '记一笔',
      content: '请输入账单信息（格式：名称,金额）',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          const [name, amount] = res.content.split(',')
          if (!name || !amount || isNaN(Number(amount))) {
            wx.showToast({ title: '格式错误', icon: 'none' })
            return
          }
          const newBill = {
            id: Date.now(),
            name: name.trim(),
            amount: Number(amount.trim()),
            date: new Date().toISOString().split('T')[0]
          }
          const bills = wx.getStorageSync('bills') || []
          bills.push(newBill)
          wx.setStorageSync('bills', bills)
          this.loadBills()
          this.calculateOverview()
          wx.showToast({ title: '添加成功' })
        }
      }
    })
  },

  // 发起分摊结算（简化为提示）
  splitBill() {
    const { monthTotal, bills } = this.data
    if (bills.length === 0) {
      wx.showToast({ title: '暂无账单可分摊', icon: 'none' })
      return
    }
    wx.showModal({
      title: '发起分摊',
      content: `本月总支出¥${monthTotal}，请和室友确认分摊金额~`,
      showCancel: false
    })
  }
})