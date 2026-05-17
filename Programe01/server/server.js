const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// 测试接口
app.get('/', (req, res) => {

    res.send('服务器启动成功')

})


// AI接口
app.post('/chat', async (req, res) => {

    const userMessage = req.body.message

    try {

        const response = await axios.post(

            'https://api.deepseek.com/chat/completions',

            {
                model: 'deepseek-chat',

                messages: [
                    {
                        role: 'user',
                        content: userMessage
                    }
                ]
            },

            {
                headers: {
                    'Content-Type': 'application/json',

                    // 替换成你的API KEY
                    'Authorization': 'Bearer sk-405c76f5b57249adba7b8e3522f8e16b'
                }
            }

        )

        const aiReply =
            response.data.choices[0].message.content

        res.send({
            reply: aiReply
        })

    } catch (error) {

        console.log(error.response?.data || error)

        res.send({
            error: 'AI调用失败'
        })
    }

})

//天气接口
app.get('/weather', async (req, res) => {

  try {

      const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast',
          {
              params: {
                  latitude: 22.5431,
                  longitude: 114.0579,
                  current_weather: true
              }
          }
      )

      const weather = response.data.current_weather || {}

      let text = '未知'

      const code = weather.weathercode

      if (code === 0) text = '晴'
      else if (code <= 3) text = '多云'
      else if (code <= 48) text = '雾'
      else if (code <= 67) text = '雨'
      else text = '天气复杂'

      res.send({
          temp: weather.temperature ?? '--',
          text: text
      })

  } catch (err) {

      console.log('天气接口错误：', err?.message || err)

      res.send({
          temp: '--',
          text: '获取失败'
      })

  }

})

// 启动服务器
app.listen(3000, () => {

    console.log('服务器运行成功')

})