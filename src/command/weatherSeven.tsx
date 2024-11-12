import {AlApi} from "../types/alapi";
import {CityWeather} from "../types/apiResponse";

export async function apply(alapi: AlApi) {

  alapi.ctx.on("message", async (session) => {
    // 匹配xxx天气
    const weatherReg = /^(.+)天气$/;
    const match = session.content.match(weatherReg);
    if (match) session.execute(`weather ${match[1]}`);
  })

  // 注册指令
  const subCmd = alapi.cmd.subcommand("weather <city:string>");
  subCmd.alias("天气");

  // 指令事件
  subCmd.action(async ({session}, city) => {

    if (!city) return session.execute("help weather");

    try {
      const data = await alapi.api.weatherSeven(city);
      if (data.code === 200 && data.data.length > 0) {
        const todayWeather = data.data[0];

        // 当 todayWeather.city 是 "北京" 时可能会出现城市名不匹配的情况，这里进行检查
        if (todayWeather.city === "北京") {
          // 检查返回数据的 `city` 是否与输入的 `city` 匹配
          if (!todayWeather.city.includes(city) && !city.includes(todayWeather.city)) {
            alapi.logger.error(`City mismatch: expected ${city}, got ${todayWeather.city}`);
            return session.text(".city_mismatch");
          }
        }
        return generateWeatherPage(data.data);
      } else {
        alapi.logger.error(`weather seven：${data.msg}\nResponseData:${JSON.stringify(data)}`);
      }
    } catch (err) {
      alapi.logger.error(`weather seven：${err}`);
    }
    return session.text(".failed");
  });
}

function generateWeatherPage(weekWeather: CityWeather[]): string {
  const todayWeather = weekWeather[0];
  const city = todayWeather.city;

  const cityInfo = `
    <div class="city_info">
      <h2>${city}</h2>
      <p>${todayWeather.hour[0].temp}°</p>
      <div class="temperature_range">
        <div class="left">
          <span class="text">最高</span>
          <span class="temperature">${todayWeather.temp_day}°</span>
        </div>
        <div>
          <span class="text">最低</span>
          <span class="temperature">${todayWeather.temp_night}°</span>
        </div>
      </div>
      <span>${todayWeather.wea_day}</span>
    </div>
  `;

  // 获取未来8小时天气数据
  const now = new Date();
  let futureHourWeather = todayWeather.hour.filter(h => new Date(h.time) >= now);

  // 如果当前天的小时数据多余8小时，则取前8条
  if (futureHourWeather.length > 8) futureHourWeather = futureHourWeather.slice(0, 8)
  // 如果当前天的小时数据不足8小时，从第二天数据补足
  else if (futureHourWeather.length < 8 && weekWeather[1]) {
    futureHourWeather = [
      ...futureHourWeather,
      ...weekWeather[1].hour.slice(0, 8 - futureHourWeather.length),
    ];
  }

  const hourWeatherItems = futureHourWeather.map(h => `
    <div class="house_item">
      <div class="hours">${new Date(h.time).getHours()}</div>
      <div class="wea">${h.wea}</div>
      <div class="temp">${h.temp}°</div>
    </div>
  `).join("");

  const hourWeatherSection = `
    <div class="house_weather">
      <div class="title">未来8小时天气</div>
      <div class="house_row">${hourWeatherItems}</div>
    </div>
  `;

  const weekWeatherRows = weekWeather.map((day, index) => `
    <div class="day_row">
      <div class="day_col">${index === 0 ? "今日" : getDayOfWeek(day.date)}</div>
      <div class="day_col">${day.wea_day}</div>
      <div class="day_col">
        <span>${day.temp_night}°</span> - <span>${day.temp_day}°</span>
      </div>
    </div>
  `).join("");

  const weekWeatherSection = `
    <div class="week_weather">
      <div class="title">7日天气预报</div>
      ${weekWeatherRows}
    </div>
  `;

  const lifeIndexRows = todayWeather.index.map(i => `
    <div class="index_row">
      <span>${i.name}</span>
      <span>${i.level}</span>
    </div>
  `).join("");

  const lifeIndexSection = `
    <div class="life_index">
      <div class="title">生活指数</div>
      ${lifeIndexRows}
    </div>
  `;


  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>天气信息</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: white;
          background: linear-gradient(135deg, #4e8ae4, #2e6faf, #162B45);
          width: 480px;
          padding: 20px;
        }

        .city_info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 0;
        }

        .city_info h2 {
          margin-top: 0;
          margin-bottom: 5px;
        }

        .city_info p {
          margin: 0;
          font-size: 48px;
        }

        .city_info .temperature_range {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .city_info .temperature_range .left {
          margin-right: 10px;
        }

        .city_info .temperature_range .text {
          writing-mode: vertical-lr;
          text-orientation: upright;
          padding: 2px 4px 0 0;
          float: left;
        }

        .city_info .temperature_range .temperature {
          font-size: 32px;
        }

        .house_weather {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #cccccc73;
          padding: 5px 10px;
          border-radius: 12px;
        }

        .house_weather .house_row {
          display: flex; /* 将 house_item 横向排列 */
          width: 100%; /* 占据父级宽度 */
          justify-content: space-around; /* 均匀分布 house_item */
        }

        .house_weather .house_row .house_item {
          display: flex;
          flex-direction: column; /* 内部元素纵向排列 */
          align-items: center; /* 居中对齐 */
          margin: 5px; /* 为每个 house_item 添加间距 */
        }

        .house_weather .house_row .house_item .temp {
          padding: 4px 0 0 0;
        }

        .week_weather {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #cccccc73;
          border-radius: 12px;
          width: 100%; /* 使 week_weather 占满父级宽度 */
          padding: 5px 10px;
          box-sizing: border-box;
        }

        .week_weather .day_row {
          display: flex;
          width: 100%; /* 占满父级宽度 */
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #dddddd6b;
          box-sizing: border-box;
        }

        .week_weather .day_row:last-child {
          border-bottom: none;
        }

        .week_weather .day_col {
          flex: 1; /* 等分宽度 */
          text-align: center;
          box-sizing: border-box;
        }

        .life_index {
          margin-top: 10px;
          border: 1px solid #cccccc73;
          border-radius: 12px;
          padding: 5px 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .life_index .index_row {
          display: flex;
          justify-content: space-between;
          padding: 5px 12px;
          border-bottom: 1px solid #dddddd6b;
        }

        .life_index .index_row:last-child {
          border-bottom: none;
        }

        /* 边框内内容半透明背景 */
        .house_weather, .week_weather, .life_index {
          background-color: rgba(0, 0, 0, 0.5); /* 半透明黑灰色 */
        }

        .title {
          font-size: 12px;
          padding: 5px 0 5px 10px;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid #dddddd6b;
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      ${cityInfo}
      ${hourWeatherSection}
      ${weekWeatherSection}
      ${lifeIndexSection}
    </body>
    </html>
  `;
}

// 获取日期对应的星期几
function getDayOfWeek(dateStr: string): string {
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const date = new Date(dateStr);
  return daysOfWeek[date.getDay()];
}
