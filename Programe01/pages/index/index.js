Page({
  data: {
    greetText: '',
    weatherData: {
      temp: '',
      text: ''
    },
    todayDuty: '',
    todayReminds: []
  },

  onLoad() {

    this.setGreetText()
    this.loadTodayDuty()
    this.loadTodayReminds()
    this.getWeather()
  
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


  getWeatherTip(temp, text) {

    let tip = ''
  
    if (text.includes('雨')) {
      tip = '今天有雨，记得带伞 ☔'
    } else if (temp >= 30) {
      tip = '天气较热，注意防暑 🥵'
    } else if (temp <= 10) {
      tip = '天气较冷，注意保暖 🧥'
    } else {
      tip = '天气舒适，适合外出 🌤️'
    }
  
    return tip
  
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

  //加载今日天气
  getWeather() {

    wx.request({
  
      url: 'http://192.168.200.96:3000/weather',
  
      method: 'GET',
  
      success: (res) => {

        console.log('🔥天气原始返回：', res.data)
      
        this.setData({
      
          weatherData: {
            temp: res.data.temp,
            text: res.data.text,
            tip: this.getWeatherTip(res.data.temp, res.data.text)
          }
      
        })
      
        console.log('🔥setData后：', this.data.weatherData)
      
      },
  
      fail: (err) => {
  
        console.log('天气请求失败', err)
  
      }
  
    })
  
  },

  // 跳转到天气页
  goToWeather() {

    wx.request({
  
      url: 'http://192.168.200.96:3000/weather',
  
      method: 'GET',
  
      success: (res) => {
  
        const temp = res.data.temp
        const text = res.data.text
  
        let advice = []
  
        // 🌧️ 天气判断
        if (text.includes('雨')) {
          advice.push('☔ 今天有雨，记得带伞')
          advice.push('🚶 减少外出，注意安全')
        } 
        else if (text.includes('晴')) {
          advice.push('🌤️ 天气晴朗，适合上课/外出')
          advice.push('🧺 适合洗衣服、晒被子')
        }
        else if (text.includes('多云')) {
          advice.push('⛅ 天气舒适，适合学习')
        }
  
        // 🌡️ 温度判断
        if (temp >= 30) {
          advice.push('🥵 高温天气，注意防暑')
          advice.push('💧 多喝水，避免剧烈运动')
        } 
        else if (temp <= 10) {
          advice.push('🧥 天气较冷，注意保暖')
        }
  
        // 🌙 时间建议
        const hour = new Date().getHours()
        if (hour >= 22) {
          advice.push('🌙 已经较晚，建议早点休息')
        }
  
        wx.showModal({
          title: 'AI天气·宿舍建议',
          content: `当前：${text} ${temp}℃\n\n${advice.join('\n')}`,
          showCancel: false
        })
  
      },
  
      fail: () => {
  
        wx.showToast({
          title: '天气获取失败',
          icon: 'none'
        })
  
      }
  
    })
  
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