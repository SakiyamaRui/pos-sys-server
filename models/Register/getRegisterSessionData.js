import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * レジセッション情報を取得
 * @param {string} r_session_id セッションID
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Object>} セッション情報が入ったリスト
 */
const getRegisterSessionData = (
    r_session_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        //
        try {
            // セッション情報を取得
            let registedData = await query(
                "SELECT * FROM `REGISTER_SESSION` WHERE `r_session_id` = ?;",
                [r_session_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(registedData);
        }catch(e) {
            reject(e);
        }
    });
}

export default getRegisterSessionData;