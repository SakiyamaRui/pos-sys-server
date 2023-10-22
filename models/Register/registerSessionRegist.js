import { query } from "../DB/DB";
import checkRegisterSession from "./checkRegisterSession";
import { nanoid } from "nanoid";
import { Connection } from "mysql";
import getRegisterSessionData from "./getRegisterSessionData";


/**
 * レジのセッションを登録
 * @param {{
 *  store_id: string,
 *  fingerprint: string
 * }} loginData セッションに紐付けるデータ
 * @param {Connection} transaction 同店舗行をロック済みのトランザクション
 * @returns {Promise<Object>} 成功した場合、セッション情報を返す
 */
const registerSessionTableRegist = ({
    store_id = "null",
    fingerprint = null,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // fingerprintからセッションを復元
            if (fingerprint != null) {
                // 同じfingerprintで、すでにセッションがないかを確認
                let result = await checkRegisterSession({
                    fingerprint,
                }, transaction).catch(err => {
                    throw err;
                });

                if (result !== false) {
                    // セッションがあるため、セッションを復元
                    resolve(result);
                    return ;
                }
            }

            // セッションIDを生成
            let r_session_id = nanoid(50);

            // 登録
            const _store_id = store_id || "null";
            await query(
                "INSERT INTO `REGISTER_SESSION`(`r_session_id`,`fingerprint`,`store_id`,`register_number`)"+
                "SELECT ?,?,?,IFNULL(max(`register_number`)+1, 1) FROM `REGISTER_SESSION` WHERE `store_id` = ? AND `session_end` IS NULL",
                [r_session_id, fingerprint, _store_id, _store_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            // 登録したセッション情報を取得
            let registedData = await getRegisterSessionData(r_session_id, transaction).catch((err) => {
                throw err;
            });

            if (registedData.length == 0) {
                throw new Error("no data inserted");
            }else {
                resolve(registedData[0]);
            }

        }catch(e) {
            reject(e);
        }
    });
}

export default registerSessionTableRegist;