import { query } from "../DB/DB";
import { Connection } from "mysql";

/**
 * 商品IDから商品情報を取得する
 * @param {Array<String>} product_id_list 
 * @param {Connection} transaction 
 * @returns {Promise<Array<Object>>} 成功した場合、商品データを返す
 */
const getProductDataListFromProductId = (product_id_list, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            //
            const placeholder = "?,".repeat(product_id_list.length).slice(0, -1);

            const response = await query(
                "SELECT * FROM `PRODUCT_MASTER` WHERE `product_id` IN(" + placeholder + ");",
                product_id_list,
                transaction
            ).catch((err) => {
                throw err;
            });


            resolve(response.map((record) => {
                return {
                    product_uuid: record.product_uuid,
                    product_id: record.product_id,
                    product_name: record.product_name,
                    price: record.price,
                    reception: Boolean(record.reception),
                    stock_check: Boolean(record.stock_check),
                }
            }));

        }catch(e) {
            reject(e);
        }
    });
}

export default getProductDataListFromProductId;