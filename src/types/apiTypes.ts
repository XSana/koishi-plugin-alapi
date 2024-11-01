export interface ZaobaoResponse {
  code: number;
  msg: string;
  data: {
    date: string;
    news: string[];
    weiyu: string;
    image: string;
    head_image: string;
  };
  time: number;
  usage: number;
  log_id: string;
}

// 定义单个省份油价信息
export interface ProvinceOilPrice {
  province: string;
  o89: number;
  o92: number;
  o95: number;
  o98: number;
  o0: number;
}

// 定义接口返回的主要结构
export interface OilPriceResponse {
  code: number;
  msg: string;
  data: ProvinceOilPrice[];
  time: number;
  usage: number;
  log_id: string;
}

// 主接口，包含响应状态、消息和节假日数据数组
export interface HolidayApiResponse {
  code: number;
  msg: string;
  data: Holiday[];
  time: number;
  usage: number;
  log_id: string;
}

// 每个节假日的数据格式
export interface Holiday {
  name: string;           // 节假日名称
  date: string;           // 节假日的日期，格式为 yyyy-MM-dd
  is_off_day: number;     // 是否为假期：1 表示休假，0 表示工作日
  year: string;           // 节假日所属的年份
}
