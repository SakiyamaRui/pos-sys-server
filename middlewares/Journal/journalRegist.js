import journalTableRegist from "../../models/Journal/journalTableRegist";
import generateOrderNumber from "../Order/generateOrderNumber";
import { Connection } from "mysql";

/**
 * ジャーナル・注文番号の登録
 * @param {{
 *  order_number: number,
 *  journal_type: number,
 *  store_id: string,
 *  registered_user: string,
 *  r_session_id: string,
 *  order_id_list: Array<string>,
 * }} journal_data ジャーナル登録に必要なデータ 
 * @param {Connection} transaction 
 * @returns {Promise<{
 *  order_number: number,
 *  journal_id: string,
 * }>} 成功した場合、ジャーナルIDと注文番号を返す
 */
const journalRegist = ({
    order_number = null,
    journal_type = 0,
    store_id,
    registered_user,
    r_session_id,
    order_id_list,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 注文番号が発行されていない場合は発行する
            if (order_number == null) {
                // 注文をまとめる
                order_number = await generateOrderNumber({
                    order_id_list,
                    store_id,
                }, transaction).catch((err) => {
                    throw err;
                });
            }

            // ジャーナルの登録
            const journal_id = await journalTableRegist({
                store_id,
                r_session_id,
                order_number,
                type: journal_type,
                registered_user,
            }, transaction).catch((err) => {
                throw err;
            });

            resolve({
                order_number,
                journal_id,
            });

        }catch(e) {
            reject(e);
        }
    });
}

export default journalRegist;