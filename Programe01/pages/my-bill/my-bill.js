Page({
  data: {
    myBillRecords: []
  },

  onLoad() {
    const bills = wx.getStorageSync('bills') || []
    this.setData({ myBillRecords: bills })
  }
})