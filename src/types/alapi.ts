import {Logger, Command, Context} from 'koishi'
import {Api} from '../api'

export interface AlApi {
  logger: Logger
  api: Api
  ctx: Context
  cmd: Command
}
