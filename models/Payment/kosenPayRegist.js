import { query } from "../DB/DB";
import flakeId from "../../helpers/flakeIdGenerate";
import { Connection } from "mysql";
import getBalance from "./getKosenPayBalance";

/**
 * 1: 入金
 * 2: 決済
 * 3: 現金で返金
 */

/**
 * KousenPayのマスターテーブルに情報を登録
 * @param {{
 *  amount: number,
 *  payment_id: string,
 *  type: number,
 *  user_id: string,
 * }} 登録データ
 * @param {Connection} transaciton 
 * @returns 
 */

const kousenpayRegist = ({
    amount,
    payment_id,
    type,
    user_id,
}, transaciton) => {
    return new Promise(async (resolve, reject) => {
        try {
            //
            const log_id = flakeId.gen();

            await getBalance(user_id, transaciton).catch((e) => {
                throw e;
            });

            // データを登録
            await query(
                "INSERT INTO `KOSEN_PAY_LOG` (`log_id`,`user_id`,`type`,`amount`,`payment_id`) VALUES (?,?,?,?,?);",
                [log_id, user_id, type, amount, payment_id],
                transaciton
            ).catch((e) => {
                throw e;
            });

            // 残高がマイナスになっていないかチェック
            const balance = await getBalance(user_id, transaciton).catch((e) => {
                throw e;
            });

            if (balance < 0) {
                resolve({
                    result: false,
                    code: -1,
                    message: "残高不足のため、処理を中断しました。",
                });
            }

            resolve({
                result: true,
                code: 0,
                message: "OK",
                log_id,
                balance,
            });
        }catch(e) {
            reject(e);
        }
    });
}

export default kousenpayRegist;