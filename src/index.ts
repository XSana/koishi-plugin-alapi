import {Context} from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import {AlApi} from './types/alapi'
import {Config} from './config'
import {Api} from './api'
import {loadLocales} from './locales'
import * as command from './command'

export const using = ["puppeteer"] as const
export {Config}

export const name = 'alapi'

export async function apply(ctx: Context, config: Config) {

  // 读取语言配置
  loadLocales(ctx)

  // 初始化alapi
  const alapi: AlApi = {
    logger: ctx.logger('alapi'),
    api: new Api(ctx.http.extend(config.requestConfig), config.alApiToken),
    ctx: ctx,
    cmd: null,
  }

  // 载入指令
  await command.apply(config, alapi);
}
