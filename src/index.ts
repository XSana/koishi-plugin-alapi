import {Command, Context, Logger} from 'koishi'

import {Config} from './config'

import * as command from './command'
import {Api} from "./api";

export interface AlApi {
  logger: Logger
  cmd: Command
  api: Api
}

export {Config}

export const name = 'alapi'

export async function apply(ctx: Context, config: Config) {

  ctx.i18n.define('zh-CN', require('./locales/zh-CN'))

  const cmd = ctx.command('alapi')

  const alapi: AlApi = {
    logger: ctx.logger('alapi'),
    cmd: cmd,
    api: new Api(ctx.http.extend(config.requestConfig), config.alApiToken),
  }
  await command.apply(ctx, config, alapi);
}
