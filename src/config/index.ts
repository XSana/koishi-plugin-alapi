import {HTTP, Schema} from "koishi"
import {AlApiConfig, AlApiRequestConfig, AlApiSwitch, Config} from "../types/config";

const alApiConfig: Schema<AlApiConfig> = Schema.object({
  alApiToken: Schema.string()
    .required(),
})

const alApiSwitch: Schema<AlApiSwitch> = Schema.object({
  zaobao: Schema.boolean().default(false),
  oil: Schema.boolean().default(false),
  holiday: Schema.boolean().default(false),
  exchange: Schema.boolean().default(false),
})

const alApiRequestConfig: Schema<AlApiRequestConfig> = Schema.object({
  requestConfig: HTTP.createConfig("https://v2.alapi.cn/api/"),
})

const Config: Schema<Config> = Schema.intersect([
  alApiConfig,
  alApiSwitch,
  alApiRequestConfig,
]).i18n({
  'zh-CN': require('../locales/zh-CN')._config,
})

// 导出 Config 以供外部使用
export {Config}
