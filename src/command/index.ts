import {Config} from "../config"
import {AlApi} from "../types/alapi"

import * as zaobao from "./zaobao"
import * as oli from "./oil"
import * as holiday from "./holiday"
import * as exchange from "./exchange"
import * as weatherSeven from "./weatherSeven"

const modules = [
  {key: "zaobao", module: zaobao},
  {key: "oil", module: oli},
  {key: "holiday", module: holiday},
  {key: "exchange", module: exchange},
  {key: "weatherSeven", module: weatherSeven},
]

export async function apply(config: Config, alapi: AlApi) {
  alapi.cmd = alapi.ctx.command("alapi")

  for (const {key, module} of modules) {
    if (config[key]) await module.apply(alapi)
  }
}
