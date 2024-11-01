import {Context} from "koishi";
import {Config} from "../config";

import {AlApi} from "../index";

import * as zaobao from "./zaobao"
import * as oli from "./oil"
import * as holiday from "./holiday"

export async function apply(ctx: Context, config: Config, alapi: AlApi) {
  if (config.zaobao) await zaobao.apply(ctx, alapi)
  if (config.oil) await oli.apply(ctx, alapi)
  if (config.holiday) await holiday.apply(ctx, alapi)
}
