import {AlApi} from "../types/alapi";
import {HolidayResponse} from "../types/apiResponse";

export async function apply(alapi: AlApi) {
  // 注册指令
  const subCmd = alapi.cmd.subcommand('holiday')
  subCmd.alias("节假日")

  // 指令事件
  subCmd.action(async (_) => {
    try {
      const year = new Date().getFullYear()
      const data = await alapi.api.holiday(year);
      if (data.code === 200) {
        return generateMessage(data)
      } else {
        alapi.logger.error(`节假日信息获取失败：${data.msg}\nResponseData:${JSON.stringify(data)}`)
      }
    } catch (err) {
      alapi.logger.error(`节假日信息获取失败：${err}`)
    }
    return "节假日信息获取失败";
  })
}

const generateMessage = (data: HolidayResponse) => {
  // 获取当前日期
  const today = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  // 整合数据，将相同名称的日期整合并区分休息日和调休日
  const holidayMap: Record<string, { offDays: string[], workDays: string[] }> = {};
  let remainingOffDays = 0;
  let remainingWorkDays = 0;

  // 分组相同节假日名称，将日期区分为休息日和调休日
  data.data.forEach(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear();
    if (holidayYear === currentYear) {
      // 统计剩余休息日和调休日
      if (holiday.is_off_day && holiday.date >= today) {
        remainingOffDays++;
      } else if (!holiday.is_off_day && holiday.date >= today) {
        remainingWorkDays++;
      }
    }

    const key = holiday.name;
    if (!holidayMap[key]) {
      holidayMap[key] = {offDays: [], workDays: []};
    }
    if (holiday.is_off_day) {
      holidayMap[key].offDays.push(holiday.date);
    } else {
      holidayMap[key].workDays.push(holiday.date);
    }
  });

  // 将日期整合为连续范围格式，并标记日期状态
  const formatDates = (dates: string[]) => {
    dates.sort();
    const ranges = [];
    let start = dates[0], end = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const current = dates[i];
      const previous = new Date(dates[i - 1]);
      previous.setDate(previous.getDate() + 1);

      if (new Date(current).toISOString().slice(0, 10) === previous.toISOString().slice(0, 10)) {
        end = current;
      } else {
        ranges.push({start, end});
        start = current;
        end = current;
      }
    }
    ranges.push({start, end});

    return ranges.map(({start, end}) => {
      const rangeText = start === end ? start : `${start} - ${end}`;
      // 根据当前日期状态添加样式
      if (today >= start && today <= end) {
        return `<span style="font-weight: bold; color: blue;">${rangeText}</span>`;
      } else if (today > end) {
        return `<span style="text-decoration: line-through; color: grey;">${rangeText}</span>`;
      }
      return rangeText;
    }).join(', ');
  };

  // 生成整合后的表格内容
  const tableRows = Object.keys(holidayMap).map(key => {
    const {offDays, workDays} = holidayMap[key];
    return `
      <tr>
        <td>${key}</td>
        <td class="off-day">${formatDates(offDays) || '-'}</td>
        <td class="work-day">${formatDates(workDays) || '-'}</td>
      </tr>
    `;
  }).join('');

  return `
    <html>
      <head>
        <title>节假日数据</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .table-container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            color: #007BFF;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 10px;
            text-align: center;
            border: 1px solid #ddd;
          }
          th {
            background-color: #007BFF;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .off-day {
            color: green;
          }
          .work-day {
            color: red;
          }
        </style>
      </head>
      <body>
        <div class="table-container">
          <h1>节假日数据表格</h1>
          <p>数据时间戳：${new Date(data.time * 1000).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  })}</p>
          <p>说明：<span style="color: grey; text-decoration: line-through;">已过去日期</span>，<span style="font-weight: bold; color: blue;">当前日期</span></p>
          <p>当前年份剩余法定节假日：${remainingOffDays}天，还需调休：${remainingWorkDays}天</p>
          <table>
            <thead>
              <tr>
                <th>节假日名称</th>
                <th>休息日</th>
                <th>调休日</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
};
