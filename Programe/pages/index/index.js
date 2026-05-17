Page({
  data: {
    greetText: '',
    weatherData: {
      temp: 22,
      text: '晴朗'
    },
    todayDuty: '',
    todayReminds: []
  },

  onLoad() {
    this.setGreetText()
    this.loadTodayDuty()
    this.loadTodayReminds()
    // 这里可以接入天气API，先写个模拟数据
  },

  // 根据时间生成问候语
  setGreetText() {
    const hour = new Date().getHours()
    let text = ''
    if (hour < 6) text = '夜深了'
    else if (hour < 12) text = '早上好'
    else if (hour < 18) text = '下午好'
    else text = '晚上好'
    this.setData({ greetText: text })
  },

  // 加载今日值日（从日程页读取数据）
  loadTodayDuty() {
    const schedules = wx.getStorageSync('schedules') || []
    const today = new Date().toISOString().split('T')[0]
    const todaySchedule = schedules.find(item => item.date === today && item.type === '值日')
    this.setData({ todayDuty: todaySchedule ? todaySchedule.content : '' })
  },

  // 加载今日提醒
  loadTodayReminds() {
    const schedules = wx.getStorageSync('schedules') || []
    const today = new Date().toISOString().split('T')[0]
    const reminds = schedules.filter(item => item.date === today && item.type !== '值日')
    this.setData({ todayReminds: reminds })
  },

  // 跳转到天气页
  goToWeather() {
    wx.navigateTo({ url: '/pages/weather/weather' })
  },

  // 晚归提醒（弹窗提示）
  showLateRemind() {
    wx.showModal({
      title: '晚归提醒',
      content: '现在已经不早啦，记得早点回宿舍，门禁前一定要到哦！',
      showCancel: false
    })
  },

  // 跳转到寝室公约页
  goToRule() {
    wx.navigateTo({ url: '/pages/rule/rule' })
  },

  // 跳转到矛盾调解AI页
  goToAiHelp() {
    wx.navigateTo({ url: '/pages/ai-help/ai-help' })
  }
})