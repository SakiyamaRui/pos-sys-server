import { query } from "../DB/DB";
import { Connection } from "mysql";


/**
 * 商品マスターテーブルから商品データを取得する
 * @param {{
 *  product_id: String,
 *  product_uuid: String
 * }} product_data 商品インデックスデータ
 * @param {Connection} transaction DBコネクション
 * @returns {Promise<Object>} 成功した場合、商品データ
 */
const getProductMasterData = ({
    product_id,
    product_uuid,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = "SELECT * FROM `PRODUCT_MASTER` WHERE ";
            let VALUES = null;

            if (typeof product_uuid == "string" && product_uuid != "null") {
                sql += "`product_uuid` = ?;";
                VALUES = product_uuid;
            }else if (typeof product_id == "string" && product_id != "null") {
                sql += "`product_id` = ?;";
                VALUES = product_id;
            }else {
                throw new Error("product_id or product_uuid is empty.");
            }

            // 商品情報の取得
            let product_data = await query(
                sql,
                [VALUES],
                transaction
            ).catch(err => {
                throw err;
            });

            if (product_data.length === 0) {
                throw new Error("product not found.");
            }

            resolve(product_data[0]);
        }catch(e) {
            reject(e);
        }
    });
}

export default getProductMasterData;