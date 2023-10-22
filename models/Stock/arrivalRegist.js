import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import crypto from "crypto";

/**
 * 在庫入荷情報の登録
 * @param {Array<Object>} stockData 在庫データ
 * @param {String} store_id 店舗識別子
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<Boolean>}
 */
const stockArrivaTablelRegist = (
    stockData,
    store_id = null,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // データをフォーマット化
            let placeholder = "(?,?,?,?,?),".repeat(stockData.length).slice(0,-1);
            let value = [];

            stockData.forEach(elm => {
                let newUUID = crypto.randomUUID();
                let s_id = elm.store_id || store_id;
                s_id = (s_id == null)? "null": s_id;

                value.push(
                    newUUID,
                    elm.product_uuid,
                    s_id,
                    elm.quantity,
                    elm.expiration_date || null
                );
            });

            // 登録処理
            await query(
                "INSERT INTO `STOCK_ARRIVAL`(`s_arrival_id`, `product_uuid`, `store_id`, `arrival_quantity`, `expiration_date`) VALUES" + placeholder,
                value,
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(true);
        }catch (e) {
            reject(e);
        }
    });
}

export default stockArrivaTablelRegist;