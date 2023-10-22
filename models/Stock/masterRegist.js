import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import crypto from "crypto";


/**
 * 在庫マスターテーブルへ登録
 * @param {{
 *  stock_id: string,
 *  product_uuid: string,
 *  store_id: string,
 *  diff: number,
 * }} stock_data 在庫情報に関するデータ
 * @param {Connection} transaction DBコネクション
 * @returns {Promise<Boolean>} 成功した場合にtrueが返る
 */
const stockMasterRegist = ({
    stock_id = null,
    product_uuid,
    store_id = null,
    diff = 0,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        // IDがない場合は生成
        if (stock_id == null) {
            stock_id = crypto.randomUUID();
        }

        // 登録処理
        let reuslt = await query(
            "INSERT INTO `STOCK_MASTER`(`stock_id`, `product_uuid`, `store_id`, `stocks`) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE `stocks` = `stocks` + (?);",
            [stock_id, product_uuid, (store_id == null)? "null": store_id, diff, diff],
            transaction
        ).catch((err) => {
            reject(err);
            return false;
        });

        if (reuslt !== false) {
            resolve(true);
        }
    });
}

export default stockMasterRegist;