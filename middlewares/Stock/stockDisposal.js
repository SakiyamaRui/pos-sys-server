import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import productStockMasterTableRock from "../../models/Stock/masterTableRock";
import stockDisposalTableRegist from "../../models/Stock/disposalRegist";
import sysConf from "../../config/service";
import stockMasterRegist from "../../models/Stock/masterRegist";


/**
 * 在庫の処分を記録する
 * @param {{
 *  product_uuid: string,
 *  store_id: string,
 *  expiration_date: string,
 *  quantity: number,
 *  reason: string,
 * }} disposalData 処分する在庫のデータ
 * @returns {Promise<String>} 成功した場合、ログIDを返す
 */
const stockDisposalRegist = ({
    product_uuid,
    store_id = "null",
    expiration_date = null,
    quantity = 0,
    reason,
}) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの取得
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return;
        }

        try {
            // テーブルをロック
            let lockedRecord = await productStockMasterTableRock(
                [{product_uuid: product_uuid, store_id: store_id}],
                "product_uuid",
                transaction
            );

            // 在庫がメインテーブルに登録されてない場合はエラー
            if (lockedRecord.length == 0) {
                throw new Error("this product stock is not registed");
            }

            // ログを記録
            let log_id = await stockDisposalTableRegist({
                product_uuid,
                store_id,
                expiration_date,
                quantity,
                reason,
            }, transaction).catch(err => {
                throw err;
            });

            // 賞味期限のテーブルの変更
            if (sysConf.stock.record_type === "expiration_date") {
                // 賞味期限ごとに在庫を減らす
            }

            // 在庫メインテーブルの変更する
            await stockMasterRegist({
                stock_id: lockedRecord[0].stock_id,
                product_uuid: product_uuid,
                store_id: store_id,
                diff: quantity * ( -1 ),
            }, transaction).catch((err) => {
                throw err;
            });

            await commit(transaction).catch((err) => {
                throw err;
            });

            resolve(log_id);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default stockDisposalRegist;