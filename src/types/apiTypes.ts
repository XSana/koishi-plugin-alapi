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
