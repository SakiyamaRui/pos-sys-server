import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * 有効なセッションかを確認
 * @param {{
 *  r_session_id: string,
 *  fingerprint: string,
 * }} session_data セッションを取得するために必要な情報
 * @param {Connection} transaction DBへのコネクション
 * @returns {Promise<Object|Boolean>} 有効なセッションがある場合はレコードを、ない場合はfalseが返る
 */
const checkRegisterSession = ({
    r_session_id = null,
    fingerprint = null,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        //
        try {
            let sql = "SELECT * FROM `REGISTER_SESSION` WHERE ";
            let param = null;

            if (r_session_id) {
                sql += "`r_session_id` = ? ";
                param = r_session_id;
            }else if (fingerprint) {
                sql += "`fingerprint` = ? ";
                param = fingerprint;
            }else{
                throw new Error("r_session_id and fingerprint is null");
            }

            // セッションが終了済みではない
            sql += "AND `session_end` IS NULL;";

            let result = await query(
                sql,
                [param],
                transaction
            ).catch((err) => {
                throw err;
            });

            if (result.length == 0) {
                resolve(false);
            }else {
                resolve(result[0]);
            }
        }catch (e) {
            reject(e);
        }
    });
}

export default checkRegisterSession;