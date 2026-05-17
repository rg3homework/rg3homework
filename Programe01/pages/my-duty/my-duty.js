Page({
  data: {
    myDutyRecords: []
  },

  onLoad() {
    const schedules = wx.getStorageSync('schedules') || []
    // 过滤出当前用户的值日记录（这里简单用type=值日过滤，演示用）
    const dutyRecords = schedules.filter(item => item.type === '值日')
    this.setData({ myDutyRecords: dutyRecords })
  }
})