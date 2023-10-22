import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";
import crypto from "crypto";


/**
 * PRODUCT_MASTERへ商品を登録
 * @param {{
 *  product_id: String,
 *  product_name: String,
 *  price: Number,
 *  reception: Boolean,
 *  stock_check: Boolean
 * }} product_data 商品データ
 * @param {Connection} transaction トランザクション開始済みのコネクション
 * @returns {Promise<String>} インサートできた場合は新しいUUIDを返す
 */
const productMasterTableRegist = ({
    product_id,
    product_name,
    price,
    reception = true,
    stock_check = true,
}, transaction) =>{
    return new Promise(async (resolve, reject) => {
        try {
            // UUIDを生成
            var product_uuid = crypto.randomUUID();

            // 登録
            let result = await query(
                "INSERT INTO `PRODUCT_MASTER`(`product_uuid`, `product_id`, `product_name`, `price`, `reception`, `stock_check`) VALUES (?,?,?,?,?,?);",
                [product_uuid, product_id, product_name, price, (reception)? 1:0, (stock_check)? 1:0],
                transaction
            ).catch((err) => {
                reject(err);
            });

            if (result.affectedRows > 0) {
                resolve(product_uuid);
            }else {
                reject(new Error("affectedRows value is 0"));
            }
        }catch (e) {
            reject(e);
        }
    });
}

export default productMasterTableRegist;
