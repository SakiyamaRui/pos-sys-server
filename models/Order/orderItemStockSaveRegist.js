import stockMasterRegist from "../Stock/masterRegist";
import stockCheck from "../Stock/stockCheck";

/**
 * 注文の在庫を確保する
 * @param {Array<String>} order_id_list 在庫を確保する注文識別子のリスト
 * @param {*} transaction 在庫テーブルがロック済みのトランザクション
 * @returns {Promise<Array>} 成功した場合、在庫データのリストが返る
 */
const orderItemStockSaveRegist = (
    order_id_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (order_id_list.length == 0) {
                throw new Error("id_list is enpty");
            }

            // 在庫確認
            let stock = await stockCheck({
                order_id_list
            }, "sub", transaction);

            let stockEnptyItem = stock.filter((elm) => elm.after_stock < 0);

            if (stockEnptyItem.length > 0) {
                throw {
                    message: "empty_item",
                    data: stockEnptyItem
                };
            }

            // 在庫を登録する
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
        }catch (e) {
            reject(e);
        }
    });
}

export default orderItemStockSaveRegist;