import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import flakeIdGenerate from "../../helpers/flakeIdGenerate";


/**
 * 注文ヘッダーの登録
 * @param {{
 *  isPaid: boolean,
 *  isStockSave: boolean,
 * }} orderHeaderData 注文ヘッダー情報
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<String>} 成功した場合、新しいorder_idが返る
 */
const orderHeaderTableRegist = ({
    isPaid = false,
    isStockSave = false,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // order_idの生成
            const order_id = flakeIdGenerate.gen();

            // 登録
            await query(
                "INSERT INTO `ORDER_HEADERS`(`order_id`,`paid`,`stock_save`) VALUES(?,?,?);",
                [order_id, (isPaid)? 1:0, (isStockSave)? 1:0],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(order_id);
        }catch(e) {
            reject(e);
        }
    });
}

export default orderHeaderTableRegist;