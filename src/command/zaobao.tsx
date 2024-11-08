import {h} from "koishi";
import {AlApi} from "../types/alapi";

export async function apply(alapi: AlApi) {
  // 注册指令
  const subCmd = alapi.cmd.subcommand("zaobao");
  subCmd.alias("今日早报");
  subCmd.alias("早报");

  // 指令事件
  subCmd.action(async ({session}) => {
    try {
      // 获取早报数据
      const data = await alapi.api.zaobao();
      if (data.code === 200) {
        // 返回早报图片
        return h("img", {src: data.data.image});
      } else {
        // 记录获取失败的日志
        alapi.logger.warn(`zaobao：${data.msg}\nResponseData: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      // 捕获异常并记录
      alapi.logger.error(`zaobao：${err}`);
    }
    return session.text(".failed");
  });
}

// const generateMessage = (data: ZaobaoResponse) => {
//   return (
//     <html>
//     <head>
//       <title>今日早报</title>
//       <style>
//         {`
//             body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 20px;
//               background-color: #f4f4f4;
//             }
//             .news-container {
//               max-width: 800px;
//               margin: auto;
//               background: white;
//               padding: 20px;
//               border-radius: 8px;
//               box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//             }
//             .news-date {
//               font-size: 1.2em;
//               color: #666;
//               text-align: right;
//             }
//             .news-item {
//               margin: 10px 0;
//               border-bottom: 1px solid #eee;
//             }
//             .news-item:last-child {
//               border-bottom: none;
//             }
//             .weiyu {
//               font-style: italic;
//               color: #007BFF;
//               margin-top: 20px;
//             }
//           `}
//       </style>
//     </head>
//     <body>
//     <div class="news-container">
//       <h1>今日新闻</h1>
//       <div class="news-date">{data.data.date}</div>
//       <div id="news-list">
//         {data.data.news.map((item) => (
//           <div class="news-item">
//             <p>{item}</p>
//           </div>
//         ))}
//       </div>
//       <div class="weiyu">{data.data.weiyu}</div>
//     </div>
//     </body>
//     </html>
//   );
// };
