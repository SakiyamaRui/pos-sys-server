import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * 注文データを取得
 * @param {Array<String>} order_id_list 取得したい注文識別子のリスト
 * @param {Connection} transaction DBコネクション
 * @returns {Promise<Array>} 成功した場合、注文データを取得
 */
const getOrderItems = (
    order_id_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // リストが空の場合はエラーを返す
            if (order_id_list.length == 0) {
                throw new Error("id_list is enpty");
            }

            const placeholder = "?,".repeat(order_id_list.length).slice(0,-1);

            let result = await query(
                "SELECT `ORDER_LINES`.*, `PRODUCT_MASTER`.`product_name`, `PRODUCT_MASTER`.`product_id` FROM `ORDER_LINES` INNER JOIN `PRODUCT_MASTER` ON `ORDER_LINES`.`product_uuid` = `PRODUCT_MASTER`.`product_uuid` WHERE `order_id` IN (" + placeholder +") AND `deleted` = 0;",
                order_id_list,
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(result);
        }catch(e) {
            reject(e);
        }
    });
}

export default getOrderItems;