// 通用响应结构
interface BaseResponse<T> {
  code: number;
  msg: string;
  data: T;
  time: number;
  usage: number;
  log_id: string;
}

// 早报接口返回的数据结构
export interface ZaobaoData {
  date: string;
  news: string[];
  weiyu: string;
  image: string;
  head_image: string;
}

export type ZaobaoResponse = BaseResponse<ZaobaoData>;

// 单个省份油价信息
export interface ProvinceOilPrice {
  province: string;
  o89: number;
  o92: number;
  o95: number;
  o98: number;
  o0: number;
}

export type OilPriceResponse = BaseResponse<ProvinceOilPrice[]>;

// 每个节假日的数据格式
export interface Holiday {
  name: string;           // 节假日名称
  date: string;           // 节假日的日期，格式为 yyyy-MM-dd
  is_off_day: number;     // 是否为假期：1 表示休假，0 表示工作日
  year: string;           // 节假日所属的年份
}

export type HolidayResponse = BaseResponse<Holiday[]>;

// 汇率接口返回的数据结构
export interface ExchangeData {
  exchange: number;
  exchange_round: number;
  currency_money: number;
  currency_form: string;
  currency_form_name: string;
  currency_to: string;
  currency_to_name: string;
  update_time: string;
}

export type ExchangeResponse = BaseResponse<ExchangeData>;

// 天气接口返回的每小时天气数据格式
export interface HourlyWeather {
  date: string;
  time: string;
  temp: string;
  wea: string;
  wea_code: string;
  wind: string;
  wind_level: string;
  air: string;
  air_level: string;
  precipitation: string;
}

// 天气接口返回的每个城市的生活指数数据格式
export interface WeatherIndex {
  name: string;
  level: string;
  code: string;
}

// 天气接口返回的每个城市的数据格式
export interface CityWeather {
  city_id: string;
  city: string;
  province: string;
  leader: string;
  date: string;
  temp_day: string;
  temp_night: string;
  wea_day: string;
  wea_day_code: string;
  wea_night: string;
  wea_night_code: string;
  wind_day: string;
  wind_night: string;
  wind_day_level: string;
  wind_night_level: string;
  air: string;
  air_level: string;
  precipitation: string;
  sunrise: string;
  sunset: string;
  hour: HourlyWeather[];
  index: WeatherIndex[];
}

export type WeatherSevenResponse = BaseResponse<CityWeather[]>;
