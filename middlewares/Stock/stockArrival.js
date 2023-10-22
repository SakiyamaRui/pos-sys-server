import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import productStockMasterTableRock from "../../models/Stock/masterTableRock";
import stockArrivaTablelRegist from "../../models/Stock/arrivalRegist";
import { generateStockIdList } from "../../helpers/generateIdList";
import stockMasterRegist from "../../models/Stock/masterRegist";
import sysConf from "../../config/service";

const stockDataColumn = {
    stock_id: null,
    product_uuid: "*UUID*",
    store_id: "*store_id*",
    quantity: 0,
    // 賞味期限 nullの場合は情報無し
    expiration_date: null,
}

/**
 * 商品の入荷情報を記録
 * 150件以上の場合は分けてリクエストを行うこと。
 * @param {Array} stockData 入荷在庫リストデータ
 * @param {String} store_id 店舗ID
 * @returns {Promise<Boolean>} 成功した場合true
 */
const stockArrivalRegist = (
    stockData,
    store_id = null,
) => {
    return new Promise(async (resolve, reject) => {
        // データが0の場合はエラーを返す
        if (stockData.length == 0) {
            reject(new Error("stockData is empty"));
            return;
        }

        // トランザクションの開始
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return;
        }

        try {
            // IDリストの作成
            let id_list = generateStockIdList(stockData, store_id);

            // 変更する在庫情報にロックをかける
            let masterRocked = await productStockMasterTableRock(
                id_list.data,
                id_list.type,
                transaction
            ).catch((err) => {
                throw err;
            });

            // 入荷情報の登録
            await stockArrivaTablelRegist(
                stockData,
                store_id,
                transaction
            ).catch((err) => {
                throw err;
            });

            // 賞味期限の登録
            if (sysConf.stock.record_type === "expiration_date") {
                // 賞味期限ごとに在庫登録
            }

            /**
             * マスターテーブルへ登録
             */
            // マスターテーブルへ登録
            for (let key in stockData) {
                await stockMasterRegist({
                    stock_id: stockData[key].stock_id || null,
                    product_uuid: stockData[key].product_uuid,
                    store_id: stockData[key].store_id || store_id,
                    diff: stockData[key].quantity
                }, transaction).catch((err) => {
                    throw err;
                });
            }

            await commit(transaction).catch((err) => {
                throw err;
            })

            resolve(true);

        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally {
            await release(transaction);
        }
    });
}

export default stockArrivalRegist;