// ALAPI 主要配置项
import {HTTP} from "koishi";

export interface AlApiConfig {
  alApiToken: string
}

// ALAPI 功能开关
export interface AlApiSwitch {
  zaobao: boolean
  oil: boolean
  holiday: boolean
  exchange: boolean
}

// ALAPI 请求配置
export interface AlApiRequestConfig {
  requestConfig: HTTP.Config
}

// 合并后的配置类型
export type Config = AlApiConfig & AlApiSwitch & AlApiRequestConfig
