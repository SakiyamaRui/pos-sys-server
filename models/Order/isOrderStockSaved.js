import { query } from "../DB/DB";


const isOrderStockSaved = (
    order_id_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 空の場合は返す
            if (order_id_list.length == 0) {
                reject(new Error("order_id_list is enpty"));
                return;
            }

            // order_id_listの中でも在庫確保済みのIDを取得
            let placeholder = "?,".repeat(order_id_list.length).slice(0, -1);

            let id_list = query(
                "SELECT * FROM `ORDER_HEADERS` WHERE `order_id` IN (" + placeholder + ") AND `stock_save` = 1",
                order_id_list,
                transaction
            ).catch(err => {
                throw err;
            });

            resolve(id_list);
        }catch(e) {
            reject(e);
        }
    })
}

export default isOrderStockSaved;