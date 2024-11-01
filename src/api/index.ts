import {HTTP} from "koishi";
import {ZaobaoResponse} from "../types/apiTypes";

const API = {
  zaobao: '/zaobao',
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

  createRequestBody = (extraParams = {}) => {
    const baseParams = {
      token: this.token,
    };
    return new URLSearchParams({...baseParams, ...extraParams});
  }
}
