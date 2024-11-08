import {AlApi} from "../types/alapi";
import {OilPriceResponse, ProvinceOilPrice} from "../types/apiResponse";

export async function apply(alapi: AlApi) {
  // 注册指令
  const subCmd = alapi.cmd.subcommand("oil");
  subCmd.alias("今日油价");
  subCmd.alias("油价");

  // 指令事件
  subCmd.action(async ({session}) => {
    try {
      const data = await alapi.api.oil();
      if (data.code === 200) {
        return generateOilPriceTable(data);
      } else {
        alapi.logger.error(`oil：${data.msg}\nResponseData:${JSON.stringify(data)}`);
      }
    } catch (err) {
      alapi.logger.error(`oil：${err}`);
    }
    return session.text(".failed");
  });
}

// 生成表格头部
function generateTableHeader() {
  return `
    <thead>
      <tr>
        <th>省份</th>
        <th>92号汽油</th>
        <th>95号汽油</th>
        <th>98号汽油</th>
        <th>柴油</th>
      </tr>
    </thead>
  `;
}

// 生成表格内容
function generateTableBody(data: OilPriceResponse) {
  return data.data
    .map(
      (item: ProvinceOilPrice) => `
      <tr>
        <td>${item.province}</td>
        <td>${item.o92 || "-"}</td>
        <td>${item.o95 || "-"}</td>
        <td>${item.o98 || "-"}</td>
        <td>${item.o0 || "-"}</td>
      </tr>
    `
    )
    .join("");
}

// 时间戳格式化
function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// 生成完整的油价表格 HTML
function generateOilPriceTable(data: OilPriceResponse) {
  const tableHeader = generateTableHeader();
  const tableBody = generateTableBody(data);
  const timestamp = formatTimestamp(data.time);

  return `
    <html>
      <head>
        <title>全国油价表格</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .table-container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
        </style>
      </head>
      <body>
        <div class="table-container">
          <h1>全国油价表格</h1>
          <p>数据时间戳：${timestamp}</p>
          <table>
            ${tableHeader}
            <tbody>
              ${tableBody}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
