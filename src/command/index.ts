import {Context} from "koishi";
import {Config} from "../config";

import * as zaobao from "./zaobao"
import {AlApi} from "../index";

export async function apply(ctx: Context, config: Config, alapi: AlApi) {
  if (config.zaobao) {
    await zaobao.apply(ctx, alapi)
  }

}
