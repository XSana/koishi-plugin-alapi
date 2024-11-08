import {AlApi} from "../types/alapi";
import {HolidayResponse} from "../types/apiResponse";

export async function apply(alapi: AlApi) {
  // 注册指令
  const subCmd = alapi.cmd.subcommand("holiday");
  subCmd.alias("节假日");

  // 指令事件
  subCmd.action(async ({session}) => {
    try {
      const year = new Date().getFullYear();
      const data = await alapi.api.holiday(year);
      if (data.code === 200) {
        return generateHolidayHtml(data);
      } else {
        alapi.logger.error(`holiday：${data.msg}\nResponseData:${JSON.stringify(data)}`);
      }
    } catch (err) {
      alapi.logger.error(`holiday：${err}`);
    }
    return session.text(".failed");
  });
}

// 生成HTML表格
const generateHolidayHtml = (data: HolidayResponse) => {
  const today = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  const holidayMap: Record<string, { offDays: string[], workDays: string[] }> = {};
  let remainingOffDays = 0;
  let remainingWorkDays = 0;

  // 处理节假日数据
  data.data.forEach(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear();
    if (holidayYear === currentYear) {
      if (holiday.is_off_day && holiday.date >= today) remainingOffDays++;
      if (!holiday.is_off_day && holiday.date >= today) remainingWorkDays++;
    }

    const key = holiday.name;
    if (!holidayMap[key]) holidayMap[key] = {offDays: [], workDays: []};
    holiday.is_off_day ? holidayMap[key].offDays.push(holiday.date) : holidayMap[key].workDays.push(holiday.date);
  });

  // 格式化日期并生成表格行
  const formatDates = (dates: string[]) => dates
    .sort()
    .map(date => formatHolidayDate(date, today))
    .join(", ");

  const tableRows = Object.entries(holidayMap)
    .map(([key, {offDays, workDays}]) => `
      <tr>
        <td>${key}</td>
        <td class="off-day">${formatDates(offDays) || "-"}</td>
        <td class="work-day">${formatDates(workDays) || "-"}</td>
      </tr>
    `).join("");

  // 返回HTML结构
  return generateHtmlStructure(data.time, tableRows, remainingOffDays, remainingWorkDays);
};

// 日期格式化及状态样式
const formatHolidayDate = (date: string, today: string) => {
  if (today === date) return `<span style="font-weight: bold; color: blue;">${date}</span>`;
  if (today > date) return `<span style="text-decoration: line-through; color: grey;">${date}</span>`;
  return date;
};

// 生成完整的HTML结构
const generateHtmlStructure = (timestamp: number, tableRows: string, remainingOffDays: number, remainingWorkDays: number) => `
  <html>
    <head>
      <title>节假日数据</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; padding: 20px; }
        .table-container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
        h1 { text-align: center; color: #007BFF; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: center; border: 1px solid #ddd; }
        th { background-color: #007BFF; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .off-day { color: green; }
        .work-day { color: red; }
      </style>
    </head>
    <body>
      <div class="table-container">
        <h1>节假日数据表格</h1>
        <p>数据时间戳：${new Date(timestamp * 1000).toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
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
