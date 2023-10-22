import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * レジ登録者のログアウト登録
 * @param {String} log_id セッションログID
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<Object>} セッション情報
 */
const registeredUserLogoutRegist = (
    log_id,
    transaction
) => {
    return new Promise(async(resolve, reject) => {
        try {
            // 登録処理
            await query(
                "UPDATE `REGISTERED_USER` SET `end_time` = CURRENT_TIMESTAMP() WHERE `log_id` = ?;",
                [log_id],
                transaction
            ).catch(err => {
                throw err
            });

            // 登録情報取得
            let result = await query(
                "SELECT * FROM `REGISTERED_USER` WHERE `log_id` = ?;",
                [log_id],
                transaction
            ).catch(err => {
                throw err;
            });

            if (result.length === 0) {
                throw new Error("登録情報が取得できませんでした。");
            }

            resolve(result[0]);
        }catch (e) {
            reject(e);
        }
    });
}

export default registeredUserLogoutRegist;