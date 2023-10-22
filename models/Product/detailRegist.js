import {
    query,
} from "../DB/DB";
import { Connection } from "mysql";

/**
 * 商品の詳細データを登録
 * @param {{
 *  product_uuid: String,
 *  maker_id: String,
 * }} product_detail 商品の詳細データ
 * @param {Connection} transaction トランザクションが開始済みのコネクション
 * @returns {Promise<Boolean>} 成功した場合はtrueが返る
 */
const productDetailTableRegist = ({
    product_uuid,
    maker_id = null,
}, transaction) => {
    return new Promise(async (resolve, reject) => {
        // 登録
        let reuslt = await query(
            "INSERT INTO `PRODUCT_DETAIL`(`product_uuid`, `maker_id`) VALUES (?,?)",
            [product_uuid, maker_id],
            transaction
        ).catch((err) => {
            reject(err);
        });

        if (reuslt.affectedRows > 0) {
            resolve(true);
        }else{
            reject(new Error("affectedRows value is 0"));
        }
    });
}

export default productDetailTableRegist;