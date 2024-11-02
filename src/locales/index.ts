import {Context} from "koishi";

export function loadLocales(ctx: Context) {
  ctx.i18n.define('zh-CN', require('./zh-CN'))
}
