import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";

/**
 * 在庫を記録する商品の取得
 * @param {Array<String>} product_uuid_list 商品UUIDのリスト
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Array<String>>} 在庫を記録する商品のUUIDのリストを返す
 */
const productIsStockRecordCheck = (
    product_uuid_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            let placeholder = "?,".repeat(product_uuid_list.length).slice(0,-1);

            let reuslt = await query(
                "SELECT `product_uuid` FROM `PRODUCT_MASTER` WHERE `product_uuid` IN(" + placeholder + ") AND `stock_check` = 1;",
                product_uuid_list,
                transaction,
            ).catch((err) => {
                throw err;
            });

            resolve(reuslt);
        }catch (e) {
            reject(e);
        }
    });
}

export default productIsStockRecordCheck;