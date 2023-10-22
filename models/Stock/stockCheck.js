import { query } from "../DB/DB";
import { Connection } from 'mysql';

/**
 * 登録された注文情報をもとに在庫数を算出
 * @param {{
 *  order_id_list: Array<String>,
 *  order_line_id_list: Array<String>
 * }} id_list 各種ID
 * @param {String} type 加減算を選択 "add" or "sub"
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Array>} 成功した場合、各在庫数のリストが返る
 */
const stockCheck = ({
    order_id_list = [],
    order_line_id_list = [],
}, type = "sub", transaction) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (
                !order_id_list.length
                &&
                !order_line_id_list.length
            ) {
                throw new Error("list datat is Enpty");
            }

            // order_id
            const order_id_placeholder = "?,".repeat(order_id_list.length).slice(0,-1);
            const order_line_id_placeholder = "?,".repeat(order_line_id_list.length).slice(0,-1);

            let sql = "SELECT `stock_id`, `STOCK_MASTER`.`product_uuid`, `STOCK_MASTER`.`store_id`, `stocks`, (`stocks` " + ((type == "add")? "+": "-") + " SUM(`quantity`)) as `after_stock` FROM `STOCK_MASTER` INNER JOIN `ORDER_LINES` ON `STOCK_MASTER`.`product_uuid` = `ORDER_LINES`.`product_uuid` AND `STOCK_MASTER`.`store_id` = `ORDER_LINES`.`store_id` WHERE `ORDER_LINES`.`deleted` = 0 AND";

            // order_id
            if (order_id_list.length !== 0) {
                // or句用
                if (order_id_list.length && order_line_id_list.length) {
                    sql += "(";
                }

                sql += "`ORDER_LINES`.`order_id` IN(" + order_id_placeholder + ")";
            }

            // OR句
            if (order_id_list.length && order_line_id_list.length) {
                sql += " OR ";
            }

            // order_line_id
            if (order_line_id_list.length) {
                sql += "`ORDER_LINES`.`order_line_id` IN(" + order_line_id_placeholder + ")";

                // or句用
                if (order_id_list.length && order_line_id_list.length) {
                    sql += ")";
                }
            }

            sql += " GROUP BY `STOCK_MASTER`.`product_uuid`, `STOCK_MASTER`.`store_id`;";

            let result = await query(
                sql,
                [...order_id_list, ...order_line_id_list],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(result);
        }catch (e) {
            reject(e);
        }
    });
}

export default stockCheck;