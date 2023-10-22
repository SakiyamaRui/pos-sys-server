import flakeIdGenerate from "../../helpers/flakeIdGenerate";
import { query } from "../DB/DB";
import { Connection } from "mysql";

/**
 * payment type
 * 0: 現金決済お預かり
 * 1: 現金決済お釣り
 * 2: 独自QR決済
 * 3: 独自決済チャージ・返金
 * 4: PayPay決済
 * 5: クーポン利用
 */

/**
 * 支払いレコードの作成
 * @param {{
 *  r_session_id: string,
 *  journal_id: string,
 *  payment_type: number,
 *  amount: number,
 * }} payment_data
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<String>} 成功した場合、決済IDを発行
 */
const paymentTableRegist = ({
    r_session_id,
    journal_id,
    payment_type,
    amount,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 決済IDの生成
            const payment_id = flakeIdGenerate.gen();

            // 登録
            await query(
                "INSERT INTO `R_PAYMENT_LOG`(`payment_id`,`r_session_id`,`journal_id`,`payment_type`,`amount`) VALUES (?,?,?,?,?);",
                [payment_id, r_session_id, journal_id, payment_type, amount],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(payment_id);
        }catch(e) {
            reject(e);
        }
    });
}

export default paymentTableRegist;