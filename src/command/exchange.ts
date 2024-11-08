import {AlApi} from "../types/alapi";

// 校验金额是否合法
function isValidAmount(money: string): boolean {
  return !isNaN(Number(money)) && Number(money) > 0;
}

// 判断货币是否相同
function isSameCurrency(from: string, to: string): boolean {
  return from === to;
}

export async function apply(alapi: AlApi) {
  // 注册主指令
  const subCmd = alapi.cmd.subcommand('exchange <money:string> <from:string> <to:string>');
  subCmd.alias("汇率");

  // 主指令事件
  subCmd.action(async ({session}, money, from, to) => {
    if (!session) return;

    // 处理 'code' 情况
    if (money?.toLowerCase() === 'code' && !from && !to) {
      return await session.execute("exchange.code");
    }

    // 检查输入参数
    if (!money || !from || !to) {
      return await session.execute("help exchange");
    }

    // 校验金额和货币
    if (!isValidAmount(money)) {
      return session.text(".invalid_amount");
    }
    if (isSameCurrency(from, to)) {
      return session.text(".same_currency");
    }

    // 获取汇率信息
    try {
      const data = await alapi.api.exchange(Number(money), from, to);
      if (data.code === 200) {
        // return `兑换结果：${data.data.currency_money} ${data.data.currency_form} = ${data.data.exchange_round} ${data.data.currency_to}`;
        return session.text('.success', [data.data.currency_money, data.data.currency_form, data.data.exchange_round, data.data.currency_to]);
      } else {
        alapi.logger.warn(`exchange：${data.msg}\nResponseData: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      alapi.logger.error(`exchange：${err}`);
    }
    return session.text(".failed");
  });

  // 注册货币代码子指令
  const subCmd2 = subCmd.subcommand('.code');
  subCmd2.alias("货币代码");

  subCmd2.action(async ({session}) => session.text('.text'));
}
