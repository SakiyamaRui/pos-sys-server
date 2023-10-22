import { query } from "../DB/DB";
import getRegisterSessionData from "./getRegisterSessionData";
import { Connection } from "mysql";


/**
 * レジセッションを終了する
 * @param {string} r_session_id 終了させるセッションID
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Object>} 成功した場合、セッション情報を返す
 */
const registerSessionTableEndRegist = (
    r_session_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 終了時間を登録
            await query(
                "UPDATE `REGISTER_SESSION` SET `session_end` = NOW() WHERE `r_session_id` = ?;",
                [r_session_id],
                transaction
            ).catch(err => {
                throw err;
            });

            // セッション情報の取得
            let sessionData = await getRegisterSessionData(r_session_id, transaction).catch(err => {
                throw err;
            });

            if (sessionData.length == 0) {
                throw new Error("セッション情報が取得できませんでした。");
            }else {
                resolve(sessionData[0]);
            }
        }catch(e) {
            reject(e);
        }
    });
}

export default registerSessionTableEndRegist;