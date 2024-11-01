import {Schema, HTTP} from "koishi";

interface AlApiConfig {
  alApiToken: string
}

const AlApiConfig: Schema<AlApiConfig> = Schema.intersect([
  Schema.object({
    alApiToken: Schema.string().description('ALAPI Token, 前往 https://www.alapi.cn/ 获取').required(),
  }),
])

interface AlApiSwitch {
  zaobao: boolean
}

const AlApiSwitch: Schema<AlApiSwitch> = Schema.object({
  zaobao: Schema.boolean().description('每日60秒早报').default(false),
})

interface AlApiRequestConfig {
  requestConfig: HTTP.Config
}

const AlApiRequestConfig: Schema<AlApiRequestConfig> = Schema.object({
  requestConfig: HTTP.createConfig("https://v2.alapi.cn/api/")
})

export type Config = AlApiConfig & AlApiSwitch & AlApiRequestConfig

export const Config: Schema<Config> = Schema.intersect([
  AlApiConfig,
  AlApiSwitch.description('ALAPI 功能开关'),
  AlApiRequestConfig
])
