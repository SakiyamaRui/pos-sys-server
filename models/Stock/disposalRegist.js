import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import crypto from "crypto";


/**
 * 在庫廃棄ログの登録
 * @param {{
 *  product_uuid: string,
 *  store_id: string,
 *  expiration_date: string,
 *  quantity: number
 * }} disposalData 廃棄する在庫のデータ
 * @param {Connection} transaction 
 * @returns {Promise<String>} 成功した場合はログIDを返す
 */
const stockDisposalTableRegist = ({
    product_uuid,
    store_id = "null",
    expiration_date,
    quantity = 0,
    reason = "",
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            // IDの生成
            let uuid = crypto.randomUUID();

            await query(
                "INSERT INTO `STOCK_DISPOSAL`(`disposal_id`,`product_uuid`,`store_id`,`expiration_date`,`quantity`, `reason`) VALUES(?,?,?,?,?,?);",
                [uuid, product_uuid, (store_id == null)? "null": store_id, expiration_date, quantity, reason],
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(uuid);
        }catch(e) {
            reject(e);
        }
    });
}

export default stockDisposalTableRegist;