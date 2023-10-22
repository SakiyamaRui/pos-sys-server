import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import flakeIdGenerate from "../../helpers/flakeIdGenerate";

/**
 * 注文商品の登録・更新
 * @param {Array<Object>} orderItems 注文する商品
 * @param {String} order_id 新しい注文識別子
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Boolean>} 成功した場合trueが返る
 */
const orderItemTableRegist = (
    orderItems,
    order_id,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let key in orderItems) {
                const order_line_id = orderItems[key].order_line_id || flakeIdGenerate.gen();
                const _order_id = orderItems[key].order_id || order_id;
                const store_id = orderItems[key].store_id || "null";
                const p_uuid = orderItems[key].product_uuid;
                const quantity = orderItems[key].quantity;
                const deleted = (orderItems[key].deleted)? 1: 0;
    
                await query(
                    "INSERT INTO `ORDER_LINES`(`order_line_id`,`order_id`,`product_uuid`,`store_id`,`unit_price`,`quantity`, `deleted`) " +
                    "VALUES (?,?,?,?,(SELECT `price` FROM `PRODUCT_MASTER` WHERE `product_uuid` = ?),?,?) " +
                    "ON DUPLICATE KEY UPDATE `quantity` = ?, `deleted` = ?;",
                    [order_line_id, _order_id, p_uuid, store_id, p_uuid, quantity, deleted, quantity, deleted],
                    transaction
                ).catch(err => {
                    throw err;
                });

                orderItems[key].order_line_id = order_line_id;
                orderItems[key].order_id = _order_id;
            }

            resolve(orderItems);
        }catch(e) {
            reject(e);
        }
    });
}

export default orderItemTableRegist;