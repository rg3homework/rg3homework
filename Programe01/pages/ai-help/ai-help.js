Page({

  data: {

    inputValue: '',

    reply: ''

  },


  // 输入监听
  onInput(e) {

    this.setData({

      inputValue: e.detail.value

    })

  },


  // 发送消息
  sendMessage() {

    if (!this.data.inputValue) {

      wx.showToast({

        title: '请输入内容',

        icon: 'none'

      })

      return

    }

    wx.request({

      // 改成你的电脑IP
      url: 'http://192.168.200.96:3000/chat',

      method: 'POST',

      data: {

        message: this.data.inputValue

      },

      success: (res) => {

        console.log(res.data)

        this.setData({

          reply: res.data.reply

        })

      },

      fail: (err) => {

        console.log(err)

        wx.showToast({

          title: '请求失败',

          icon: 'none'

        })

      }

    })

  }

})