import {AlApi} from "../types/alapi";
import {HolidayResponse} from "../types/apiResponse";

export async function apply(alapi: AlApi) {
  // 注册指令
  const subCmd = alapi.cmd.subcommand('exchange <money:string> <from:string> <to:string>')
  subCmd.alias("汇率")

  // 指令事件
  subCmd.action(async ({session}, money, from, to) => {
    if (!session) return

    if (money?.toLowerCase() === 'code' && !from && !to) {
      return await session?.execute("exchange.code")
    }

    if (!money || !from || !to) {
      return await session?.execute("help exchange")
    }

    if (isNaN(Number(money)) || money <= '0') {
      return "请输入正确的金额"
    }

    if (from === to) {
      return "货币相同，无需转换"
    }

    try {
      const data = await alapi.api.exchange(Number(money), from, to);
      if (data.code === 200) {
        return `兑换结果：${data.data.currency_money} ${data.data.currency_form} = ${data.data.exchange_round} ${data.data.currency_to}`
      } else {
        alapi.logger.error(`汇率信息获取失败：${data.msg}\nResponseData:${JSON.stringify(data)}`)
      }
    } catch (err) {
      alapi.logger.error(`汇率信息获取失败：${err}`)
    }
    return "汇率信息获取失败";
  })

  const subCmd2 = subCmd.subcommand('.code')
  subCmd2.alias("货币代码")

  subCmd2.action(async (_) => {
    return `常用货币代码：
USD：美元，美国
EUR：欧元，欧洲联盟
JPY：日元，日本
GBP：英镑，英国
CHF：瑞士法郎，瑞士
AUD：澳大利亚元，澳大利亚
CAD：加拿大元，加拿大
NZD：新西兰元，新西兰
HKD：港币，香港
CNY：人民币，中国
JPY：日元，日本
EUR：欧元，欧洲联盟
GBP：英镑，英国
USD：美元，美国
AUD：澳大利亚元，澳大利亚`
  })
}
