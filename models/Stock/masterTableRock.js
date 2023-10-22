import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";


/**
 * 在庫マスターテーブルをロックする
 * @param {Array<Object>} lockIdList ロックする商品在庫のIDリスト
 * @param {String} idType 参照IDの種類 "stock_id" or "product_uuid"
 * @param {Connection} transaction トランザクション開始済みのDBコネクション
 * @returns {Promise<Array>} ロック済みのデータのレコード
 */
const productStockMasterTableRock = (
    lockIdList,
    idType,
    transaction
) => {
    return new Promise (async (resolve, reject) => {
        //
        try {
            if (idType == "product_uuid") {
                let idList = [];
                let placeholder = "(?,?),".repeat(lockIdList.length).slice(0, -1);

                lockIdList.forEach(elm => {
                    idList.push(elm.product_uuid, (elm.store_id == null)? "null": elm.store_id);
                });

                let result = await query(
                    "SELECT * FROM `STOCK_MASTER` WHERE (`product_uuid`, `store_id`) IN("+ placeholder +");",
                    idList,
                    transaction
                ).catch((err) => {
                    throw err;
                });

                if (result.length > 0) {
                    lockIdList = result;
                }else {
                    resolve([]);
                }
    
            }else {
                reject(new Error("unsupported id types"));
            }

            let idList = lockIdList.map(elm => elm.stock_id);
            let placeholder = "?,".repeat(lockIdList.length).slice(0, -1);

            let result = await query(
                "SELECT * FROM `STOCK_MASTER` WHERE `stock_id` IN("+ placeholder +") FOR UPDATE;",
                idList,
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

export default productStockMasterTableRock;