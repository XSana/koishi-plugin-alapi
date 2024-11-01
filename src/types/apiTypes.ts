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
