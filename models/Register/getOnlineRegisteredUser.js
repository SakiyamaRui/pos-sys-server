import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * オンラインの登録者を取得
 * @param {String} r_session_id ユーザーの取得したいレジセッションID
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<Object>} ログイン中のユーザーのリスト
 */
const getOnlineRegisteredUser = (
    r_session_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // ログアウトしていないユーザーの取得
            let result = await query(
                "SELECT * FROM `REGISTERED_USER` WHERE `r_session_id` = ? AND `end_time` IS NULL;",
                [r_session_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(result);
        }catch(e) {
            reject(e);
        }
    });
}

export default getOnlineRegisteredUser;