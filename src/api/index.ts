import {HTTP} from "koishi";
import {
  ExchangeResponse,
  HolidayResponse,
  OilPriceResponse,
  WeatherSevenResponse,
  ZaobaoResponse
} from "../types/apiResponse";

const API = {
  zaobao: '/zaobao',
  oil: '/oil',
  holiday: '/holiday',
  exchange: '/exchange',
  weatherSeven: '/tianqi/seven',
}

export class Api {

  http: HTTP;
  token: string

  constructor(http: HTTP, alApiToken: string) {
    this.http = http;
    this.token = alApiToken;
    this.http.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  async zaobao(): Promise<ZaobaoResponse> {
    return this.http.post(API.zaobao, this.createRequestBody({format: 'json'}));
  }

  async oil(): Promise<OilPriceResponse> {
    return this.http.post(API.oil, this.createRequestBody());
  }

  async holiday(year: Number): Promise<HolidayResponse> {
    return this.http.post(API.holiday, this.createRequestBody({year: year}));
  }

  async exchange(money: number, from: string, to: string): Promise<ExchangeResponse> {
    return this.http.post(API.exchange, this.createRequestBody({money: money, from: from, to: to}));
  }

  async weatherSeven(city: string): Promise<WeatherSevenResponse> {
    return this.http.post(API.weatherSeven, this.createRequestBody({city: city}));
  }

  createRequestBody = (extraParams = {}) => {
    const baseParams = {
      token: this.token,
    };
    return new URLSearchParams({...baseParams, ...extraParams});
  }
}
