import { query } from "../DB/DB";
import { Connection } from "mysql";

/**
 * 新しく注文番号を発行する
 * @param {String} store_id 店舗識別子
 * @param {Connection} transaction DBトランザクション
 * @returns {Promise<Number>} トランザクションにロックをかけたまま、新しい注文番号を返します
 */
const getNewOrderNumber = async (
    store_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // ロックかけて、最新の注文番号を取得
            const res = await query(
                "SELECT (MAX(`order_number`) + 1) as 'new_number' FROM `ORDER_NUMBERS` WHERE `store_id` = ? AND `order_date` = CURDATE() AND `deleted` = 0 FOR UPDATE;",
                [store_id],
                transaction
            ).catch((err) => {
                throw err;
            });

            let new_number = res[0].new_number;

            if (new_number == null) {
                new_number = 1;
            }

            resolve(new_number);
        }catch(e) {
            reject(e);
        }
    });
}

export default getNewOrderNumber;