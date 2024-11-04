// 早报接口返回的主要结构
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

// 单个省份油价信息
export interface ProvinceOilPrice {
  province: string;
  o89: number;
  o92: number;
  o95: number;
  o98: number;
  o0: number;
}

// 油价接口返回的主要结构
export interface OilPriceResponse {
  code: number;
  msg: string;
  data: ProvinceOilPrice[];
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

// 节假日接口返回的主要结构
export interface HolidayResponse {
  code: number;
  msg: string;
  data: Holiday[];
  time: number;
  usage: number;
  log_id: string;
}

export interface ExchangeResponse {
  code: number;
  msg: string;
  data: {
    exchange: number;
    exchange_round: number;
    currency_money: number;
    currency_form: string;
    currency_form_name: string;
    currency_to: string;
    currency_to_name: string;
    update_time: string;
  };
  time: number;
  usage: number;
  log_id: string;
}
