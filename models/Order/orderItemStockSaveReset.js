import stockMasterRegist from "../Stock/masterRegist";
import stockCheck from "../Stock/stockCheck";
import isOrderStockSaved from "./isOrderStockSaved";


/**
 * 在庫確保済みの注文の在庫開放
 * @param {Array<String>} order_id_list 在庫をもとに戻す注文識別子のリスト
 * @param {*} transaction すでに在庫テーブルがロックされているコネクション
 * @returns {Promise<Array>} 成功した場合、在庫確認データの配列が返る
 */
const orderItemStockSaveReset = (
    order_id_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        //
        try {
            // 空の場合は返す
            if (order_id_list.length == 0) {
                throw new Error("id_list is enpty");
            }

            // order_id_listの中でも在庫確保済みのIDを取得
            let stockSaveOrderId = await isOrderStockSaved(order_id_list, transaction).catch((err) => {
                throw err;
            });

            if (stockSaveOrderId.length == 0) {
                resolve([]);
                return ;
            }

            // 
            let stock = await stockCheck({
                order_id_list: stockSaveOrderId.map((elm) => elm.order_id),
            }, "add", transaction);

            // 在庫取得前のデータに戻す
            for (let key in stock) {
                const stock_id = stock[key].stock_id;
                const diff = stock[key].after_stock - stock[key].stocks;

                await stockMasterRegist({
                    stock_id,
                    product_uuid: "",
                    diff,
                }, transaction).catch(err => {
                    throw err;
                });
            }

            resolve(stock);
        }catch(e) {
            reject(e);
        }
    });
}

export default orderItemStockSaveReset;