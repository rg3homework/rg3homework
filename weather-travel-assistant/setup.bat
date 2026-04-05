@echo off
chcp 65001 >nul
echo 🚀 开始初始化天气出行助手...
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    echo 请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 已安装：%NODE_VERSION%
echo.

REM 检查 npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm 未安装
    pause
    exit /b 1
)

echo 📦 正在安装依赖...
call npm install

REM 检查并创建必要目录
if not exist "plans" mkdir plans
if not exist "server" mkdir server
if not exist "public" mkdir public

echo.
echo ✅ 初始化完成！
echo.
echo ⚠️  下一步：
echo 1. 获取天气 API 密钥：
echo    打开 https://openweathermap.org/api
echo    注册账户，复制 API 密钥
echo.
echo 2. 配置 API 密钥：
echo    编辑 .env 文件
echo    找到 WEATHER_API_KEY=your_api_key_here
echo    替换为你   API 密钥
echo.
echo 3. 启动服务器：
echo    npm start
echo.
echo 4. 打开浏览器：
echo    http://localhost:3000
echo.
pause