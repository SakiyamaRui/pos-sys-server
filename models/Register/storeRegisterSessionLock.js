import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * 同じ店舗の同じ店舗のセッション行にロックをかける
 * @param {String} store_id ロックをかける店舗ID
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Boolean>} 成功した場合trueが返る
 */
const storeRegisterSesssionLock = (
    store_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const _store_id = store_id || "null";

            await query(
                "SELECT * FROM `REGISTER_SESSION` WHERE `store_id` = ? FOR UPDATE;",
                [_store_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(true);
        }catch(e) {
            reject(e);
        }
    });
}

export default storeRegisterSesssionLock;