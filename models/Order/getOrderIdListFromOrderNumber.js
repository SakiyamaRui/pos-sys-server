import { Connection } from "mysql";
import { query } from "../DB/DB";

/**
 * 
 * @param {String} order_date 注文日
 * @param {Number} order_number 注文番号
 * @param {Connection} transaction 
 * @returns {Promise<String[]>}
 */
const getOrderIdListFromOrderNumber = (
    order_date,
    order_number,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            //
            const order_id_list = await query(
                "SELECT * FROM `ORDER_NUMBERS` WHERE `store_id` = 'null' AND `order_date` = ? AND `order_number` = ? AND `deleted` = 0;",
                [order_date, order_number],
                transaction
            ).catch((err) => {
                throw err;
            });


            resolve(order_id_list.map((elm) => elm.order_id));
        }catch(e) {
            reject(e);
        }
    });
}

export default getOrderIdListFromOrderNumber;