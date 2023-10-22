import { query } from "../DB/DB";
import flakeId from "../../helpers/flakeIdGenerate";
import { Connection } from "mysql";

/**
 * ジャーナルタイプ
 * 0: 一般支払い
 * 1: VOID
 * 2: 両替
 */


/**
 * ジャーナルの生成
 * @param {{
 *  store_id: string,
 *  r_session_id: string,
 *  order_number: number,
 *  type: number,
 *  registered_user: string,
 * }} journal_regist_data ジャーナルデータ
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<String>} 成功した場合、ジャーナルのIDを返す
 */
const journalTableRegist = ({
    store_id,
    r_session_id,
    order_number,
    type,
    registered_user,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // IDの生成
            const journal_id = flakeId.gen();
            const _store_id = (store_id)? store_id: "null";

            // 登録
            await query(
                "INSERT INTO `R_JOURNAL`(`journal_id`,`store_id`,`r_session_id`,`order_number`,`type`,`registered_user`) VALUES(?,?,?,?,?,?);",
                [journal_id, _store_id, r_session_id, order_number, type, registered_user],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(journal_id);
        }catch(e) {
            reject(e);
        }
    });
}

export default journalTableRegist;