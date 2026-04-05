const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 天气API配置
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 城市数据库
const cityDatabase = {
  '北京': { lat: 39.9042, lon: 116.4074 },
  '上海': { lat: 31.2304, lon: 121.4737 },
  '广州': { lat: 23.1291, lon: 113.2644 },
  '深圳': { lat: 22.5431, lon: 114.0579 },
  '杭州': { lat: 30.2741, lon: 120.1551 },
  '成都': { lat: 30.5728, lon: 104.0668 },
  '西安': { lat: 34.3416, lon: 108.9398 },
  '南京': { lat: 32.0603, lon: 118.7969 },
};

// 出行建议生成器
class TravelAdviceGenerator {
  generateAdvice(weather) {
    const { temp, humidity, windSpeed, description } = weather;
    const advice = {
      clothing: this.getClothingAdvice(temp),
      transportation: this.getTransportationAdvice(windSpeed),
      activity: this.getActivityAdvice(temp, humidity),
      warnings: this.getWarnings(weather),
    };
    return advice;
  }

  getClothingAdvice(temp) {
    if (temp < 0) return '穿厚重冬衣，戴帽子和手套';
    if (temp < 10) return '穿秋冬衣物，建议穿夹克';
    if (temp < 20) return '穿长袖，可加薄外套';
    if (temp < 30) return '穿短袖或T恤，防晒';
    return '穿轻薄衣物，多喝水';
  }

  getTransportationAdvice(windSpeed) {
    if (windSpeed > 10) return '风力较大，不建议骑行，建议乘坐公共交通或驾车';
    if (windSpeed > 5) return '有微风，骑行注意安全';
    return '适合任何交通方式，骑行最佳';
  }

  getActivityAdvice(temp, humidity) {
    if (temp < 5 || temp > 35) return '气温不适合户外活动，建议室内活动';
    if (humidity > 80) return '湿度较高，建议选择通风的户外活动';
    return '适合户外活动，天气舒适';
  }

  getWarnings(weather) {
    const warnings = [];
    if (weather.description.toLowerCase().includes('rain')) warnings.push('有降雨，出门携带雨具');
    if (weather.description.toLowerCase().includes('snow')) warnings.push('有降雪，注意行路安全');
    if (weather.temp > 35) warnings.push('高温预警，避免长时间户外活动');
    if (weather.temp < -5) warnings.push('低温预警，防止冻伤');
    return warnings;
  }
}

// 城市识别函数
function recognizeCity(cityName) {
  const normalized = cityName.trim();
  return cityDatabase[normalized];
}

// 获取天气数据函数
async function fetchWeatherData(cityInfo) {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: 'zh_cn',
      },
    });

    const data = response.data;
    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].main,
      details: data.weather[0].description,
      pressure: data.main.pressure,
    };
  } catch (error) {
    throw new Error(`获取天气数据失败: ${error.message}`);
  }
}

// 保存计划文件函数
async function saveTravelPlan(planData) {
  const plansDir = path.join(__dirname, '../plans');
  
  try {
    await fs.mkdir(plansDir, { recursive: true });
    
    const fileName = `plan_${planData.city}_${Date.now()}.json`;
    const filePath = path.join(plansDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(planData, null, 2), 'utf-8');

    return {
      fileName,
      path: filePath,
      timestamp: planData.timestamp,
    };
  } catch (error) {
    throw new Error(`保存计划文件失败: ${error.message}`);
  }
}

// 主处理函数
async function processTravelAdviceRequest(city) {
  try {
    // 1. 识别城市
    const cityInfo = recognizeCity(city);
    if (!cityInfo) {
      throw new Error(`未识别的城市: ${city}。支持城市: ${Object.keys(cityDatabase).join('、')}`);
    }

    // 2. 获取天气数据
    const weather = await fetchWeatherData(cityInfo);

    // 3. 生成出行建议
    const adviceGenerator = new TravelAdviceGenerator();
    const advice = adviceGenerator.generateAdvice(weather);

    // 4. 保存计划文件
    const timestamp = new Date().toISOString();
    const planFile = await saveTravelPlan({
      city,
      timestamp,
      weather,
      advice,
    });

    // 5. 返回结果
    return {
      success: true,
      city,
      weather,
      advice,
      planFile,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// 路由：生成出行建议
app.post('/api/travel-advice', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({
      success: false,
      error: '城市不能为空',
    });
  }

  const result = await processTravelAdviceRequest(city);
  res.json(result);
});

// 路由：获取历史计划
app.get('/api/plans', async (req, res) => {
  try {
    const plansDir = path.join(__dirname, '../plans');
    const files = await fs.readdir(plansDir);
    res.json({ 
      success: true,
      files,
      count: files.length 
    });
  } catch (error) {
    res.json({ 
      success: true,
      files: [], 
      count: 0 
    });
  }
});

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    supportedCities: Object.keys(cityDatabase)
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ 服务器运行在 http://localhost:${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🌐 前端地址: http://localhost:${PORT}`);
  console.log(`\n支持的城市: ${Object.keys(cityDatabase).join('、')}\n`);
});
