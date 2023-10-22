import flakeIdGenerate from "../../helpers/flakeIdGenerate";
import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * 注文IDと注文番号の紐付けを行う
 * @param {{
 *  order_id: string,
 *  order_number: number,
 *  store_id: string
 * }} data 登録情報
 * @param {Connection} transaction 
 * @returns {Promise<Boolean>} 成功した場合はtrueが返る
 */
const orderLinkRegist = ({
    order_id,
    order_number,
    store_id
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        //
        try {
            // IDの生成
            const order_number_id = flakeIdGenerate.gen();

            // 注文番号と注文IDの紐付け
            await query(
                "INSERT INTO `ORDER_NUMBERS`(`order_number_id`,`store_id`,`order_date`,`order_number`,`order_id`,`deleted`) VALUES(?,?,CURDATE(),?,?,0) ON DUPLICATE KEY UPDATE `order_id` = ?;",
                [order_number_id, store_id, order_number, order_id, order_id],
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

export default orderLinkRegist;