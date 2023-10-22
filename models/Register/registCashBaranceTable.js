import { query } from "../DB/DB";
import flakeId from "../../helpers/flakeIdGenerate";
import { Connection } from "mysql";

/**
 * 
 * @param {{
 *  r_session_id: string,
 *  user_id: string,
 *  data: Array<{
 *    denomination: number,
 *    quantity: number,
 *  }>
 * }} 登録情報 
 * @param {Connection} transaction 
 * @returns {Promise<boolean>} 成功した場合trueを返す
 */
const registCashBaranceTable = (
    {
        r_session_id,
        user_id,
        data,
    },
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 現在の時間
            let now = new Date();

            // SQL、データの生成
            let placeholder = "";
            let values = [];

            data.forEach((elm) => {
                //
                placeholder += "(?,?,?,?,?,?),";
                values.push(
                    flakeId.gen(),
                    r_session_id,
                    user_id,
                    now,
                    elm.denomination,
                    elm.quantity
                );
            });

            // テーブルに登録
            await query(
                "INSERT INTO `R_CASH_BALANCE`(`cash_balance_id`,`r_session_id`,`user_id`,`registed`,`denomination`,`quantity`) VALUES " + placeholder.slice(0, -1) + ";",
                values,
                transaction,
            ).catch(err => {
                throw err;
            });

            // 合計金額を取得

            resolve(true);
        }catch(e) {
            reject(e);
        }
    });
}

export default registCashBaranceTable;