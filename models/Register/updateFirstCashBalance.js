import { query } from "../DB/DB";


/**
 * レジセッションの初回在高登録フラグを更新する
 * @param {String} r_session_id レジセッションID
 * @param {Boolean} values 初回在高登録済みフラグ
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<boolean>}
 */
const updateFirstCashBalance = (r_session_id, values, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            await query(
                "UPDATE `REGISTER_SESSION` SET `first_cash_balance` = ? WHERE `r_session_id` = ?;",
                [(values)? 1:0, r_session_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(true);
        }catch (e) {
           reject(e);
        }
    });
}

export default updateFirstCashBalance;