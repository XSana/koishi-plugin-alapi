import {HTTP} from "koishi";
import {HolidayApiResponse, OilPriceResponse, ZaobaoResponse} from "../types/apiTypes";

const API = {
  zaobao: '/zaobao',
  oil: '/oil',
  holiday: '/holiday'
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

  async holiday(year: Number): Promise<HolidayApiResponse> {
    return this.http.post(API.holiday, this.createRequestBody({year: year}));
  }

  createRequestBody = (extraParams = {}) => {
    const baseParams = {
      token: this.token,
    };
    return new URLSearchParams({...baseParams, ...extraParams});
  }
}
