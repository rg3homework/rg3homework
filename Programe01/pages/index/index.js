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

  // 晚归提醒：工作日22:30后才会弹出
  showLateRemind() {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const day = now.getDay() // 0=周日, 1=周一~5=周五, 6=周六

    // 判断条件：周一到周五，且时间 >= 22:30
    const isWorkday = day >= 1 && day <= 5
    const isLateTime = hour > 22 || (hour === 22 && minute >= 30)

    if (isWorkday && isLateTime) {
      wx.showModal({
        title: '晚归提醒',
        content: '现在已经不早啦，记得早点回宿舍，门禁前一定要到哦！',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '现在还早呢，不用急~ 不过也别玩太晚啦！',
        showCancel: false
      })
    }
  },

  // 跳转到寝室公约页
  goToRule() {
    wx.navigateTo({ url: '/pages/rule/rule' })
  },

  // 跳转到矛盾调解AI页
  goToAiHelp() {
    wx.navigateTo({ url: '/pages/ai-help/ai-help' })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setGreetText()
    this.loadTodayDuty()
    this.loadTodayReminds()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})