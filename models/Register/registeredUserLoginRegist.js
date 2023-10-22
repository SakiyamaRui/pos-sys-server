import { query } from "../DB/DB";
import { Connection } from "mysql";
import flakeId from "../../helpers/flakeIdGenerate";


/**
 * レジ登録者のログイン情報の登録
 * @param {String} user_id ユーザー識別子
 * @param {String} r_session_id レジのセッションID
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<Object>} セッション情報
 */
const registeredUserLoginRegist = (
    user_id,
    r_session_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // ログIDを
            let log_id = flakeId.gen();

            // 登録処理
            await query(
                "INSERT INTO `REGISTERED_USER`(`log_id`,`r_session_id`,`user_id`) VALUES (?,?,?);",
                [log_id, r_session_id, user_id],
                transaction
            ).catch(err => {
                throw err;
            });

            // 登録した情報を確認
            let sessionData = await query(
                "SELECT * FROM `REGISTERED_USER` WHERE `log_id` = ?;",
                [log_id],
                transaction
            ).catch(err => {
                throw err;
            });

            if (sessionData.length === 0) throw new Error("ログインの登録処理に失敗しました。");

            resolve(sessionData[0]);
        }catch(e) {
            reject(e);
        }
    });
}

export default registeredUserLoginRegist;