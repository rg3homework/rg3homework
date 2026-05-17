Page({
  data: {
    weeks: ['日','一','二','三','四','五','六'],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    days: [],
    selectedDate: '',
    selectedSchedules: []
  },

  onLoad() {
    this.initCalendar()
    this.loadSchedules()
  },

  // 初始化日历
  initCalendar() {
    const { currentYear, currentMonth } = this.data
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay() // 当月第一天是周几
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate() // 当月总天数
    const days = []
    // 补前面的空白
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', date: '' })
    }
    // 填充当月日期
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2,'0')}-${String(i).padStart(2,'0')}`
      days.push({
        day: i,
        date: dateStr,
        isToday: dateStr === todayStr,
        hasSchedule: false
      })
    }
    this.setData({ days, selectedDate: todayStr })
    this.updateDayMarkers()
    this.loadSelectedSchedules(todayStr)
  },

  // 更新日程标记
  updateDayMarkers() {
    const schedules = wx.getStorageSync('schedules') || []
    const { days } = this.data
    days.forEach(day => {
      day.hasSchedule = schedules.some(s => s.date === day.date)
    })
    this.setData({ days })
  },

  // 加载所有日程
  loadSchedules() {
    this.updateDayMarkers()
  },

  // 选择日期
  selectDay(e) {
    const date = e.currentTarget.dataset.date
    if (!date) return
    this.setData({ selectedDate: date })
    this.loadSelectedSchedules(date)
  },

  // 加载选中日期的日程
  loadSelectedSchedules(date) {
    const schedules = wx.getStorageSync('schedules') || []
    const selected = schedules.filter(item => item.date === date)
    this.setData({ selectedSchedules: selected })
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data
    if (currentMonth === 1) {
      currentYear--
      currentMonth = 12
    } else {
      currentMonth--
    }
    this.setData({ currentYear, currentMonth })
    this.initCalendar()
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data
    if (currentMonth === 12) {
      currentYear++
      currentMonth = 1
    } else {
      currentMonth++
    }
    this.setData({ currentYear, currentMonth })
    this.initCalendar()
  },

  // 跳转到新建日程（这里简化为弹窗，也可以单独做页面）
  goToAddSchedule() {
    wx.showModal({
      title: '新建日程',
      editable: true,
      placeholderText: '请输入日程内容（如：倒垃圾/值日）',
      success: (res) => {
        if (res.confirm && res.content) {
          const newSchedule = {
            id: Date.now(),
            date: this.data.selectedDate,
            type: '日程',
            content: res.content
          }
          const schedules = wx.getStorageSync('schedules') || []
          schedules.push(newSchedule)
          wx.setStorageSync('schedules', schedules)
          this.loadSelectedSchedules(this.data.selectedDate)
          this.updateDayMarkers()
          wx.showToast({ title: '添加成功' })
        }
      }
    })
  }
})