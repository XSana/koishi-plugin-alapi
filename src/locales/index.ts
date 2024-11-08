import {Context} from "koishi";

export function loadLocales(ctx: Context) {
  ctx.i18n.define('zh', require('./zh-CN'))
  ctx.i18n.define('zh-CN', require('./zh-CN'))
}
