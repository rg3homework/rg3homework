const API_BASE_URL = 'http://localhost:3000/api';

const cityInput = document.getElementById('cityInput');
const searchForm = document.getElementById('searchForm');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');
const searchBtn = document.getElementById('searchBtn');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showError('请输入城市名称');
    return;
  }

  await fetchTravelAdvice(city);
});

async function fetchTravelAdvice(city) {
  try {
    showLoading(true);
    hideError();
    hideResult();

    const response = await fetch(`${API_BASE_URL}/travel-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });

    const data = await response.json();

    if (data.success) {
      displayResult(data);
      cityInput.value = '';
    } else {
      showError(data.error || '获取数据失败');
    }
  } catch (error) {
    console.error('Error:', error);
    showError('网络错误：' + error.message);
  } finally {
    showLoading(false);
  }
}

function displayResult(data) {
  const { city, weather, advice, planFile } = data;

  document.getElementById('resultCity').textContent = `${city} 天气预报`;
  document.getElementById('tempValue').textContent = weather.temp;
  document.getElementById('feelsLike').textContent = weather.feelsLike;
  document.getElementById('humidity').textContent = weather.humidity;
  document.getElementById('windSpeed').textContent = weather.windSpeed.toFixed(1);
  document.getElementById('pressure').textContent = weather.pressure;
  document.getElementById('description').textContent = weather.details;

  document.getElementById('clothingAdvice').textContent = advice.clothing;
  document.getElementById('transportationAdvice').textContent = advice.transportation;
  document.getElementById('activityAdvice').textContent = advice.activity;

  const warningsContainer = document.getElementById('warningsContainer');
  const warningsList = document.getElementById('warningsList');

  if (advice.warnings && advice.warnings.length > 0) {
    warningsList.innerHTML = advice.warnings
      .map(warning => `<li>${warning}</li>`)
      .join('');
    warningsContainer.style.display = 'block';
  } else {
    warningsContainer.style.display = 'none';
  }

  document.getElementById('fileName').textContent = planFile.fileName;
  document.getElementById('saveTime').textContent = new Date(planFile.timestamp).toLocaleString('zh-CN');

  showResult();
}

function showLoading(show) {
  loadingDiv.style.display = show ? 'block' : 'none';
  searchBtn.disabled = show;
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function hideError() {
  errorDiv.style.display = 'none';
}

function showResult() {
  resultDiv.style.display = 'block';
}

function hideResult() {
  resultDiv.style.display = 'none';
}

// 页面加载时检查服务器
window.addEventListener('load', async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ 服务器健康检查成功:', data);
  } catch (error) {
    console.error('❌ 无法连接到服务器:', error);
    showError('❌ 无法连接到服务器。请确保后端服务已启动：npm start');
  }
});
