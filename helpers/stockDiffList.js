
/**
 * 在庫情報の差分の合計を算出、リストの作成
 * @param {Array<Object>} stockData 在庫情報リスト
 * @param {String} store_id_ 店舗識別子
 * @param {Array} lock_list ロック済みのリスト
 * @returns {Object} オブジェクト形式の商品別の在庫数リスト
 */
const generateStockDiffList = (
    stockData,
    store_id_ = null,
    lock_list
) => {
    let stockDiffList = {};

    stockData.forEach(elm => {
        // 商品識別子がリストの中にない場合はスペースを作成
        if (!stockDiffList.hasOwnProperty(elm.product_uuid)) {
            stockDiffList[elm.product_uuid] = [];
        }

        // 賞味期限を取得
        const expiration_date = elm.expiration_date || null;
        const store_id = elm.store_id || store_id_;

        // 同じ店舗・賞味期限の配列番号を検索
        let index = stockDiffList[elm.product_uuid].findIndex((elm) => {
            return (
                elm.expiration_date === expiration_date
                &&
                elm.store_id === store_id
            );
        });

        if (index !== -1) {
            // 同じ賞味期限の個数を追加
            stockDiffList[elm.product_uuid][index].quantity += elm.quantity;
        }else {
            // 在庫マスターテーブルのIDを取得
            let stock_uuid = lock_list.find(record => {
                return (
                    record.product_uuid == elm.product_uuid
                    &&
                    record.store_id == store_id
                );
            }) || null;

            // レコードを取得できた場合はカラムから値を取り代入
            if (stock_uuid) {
                stock_uuid = stock_uuid.stock_id
            }

            // 新しく賞味期限のスペースを作成
            stockDiffList[elm.product_uuid].push({
                store_id,
                quantity: elm.quantity,
                expiration_date,
                stock_id: stock_uuid,
            });
        }
    });

    return stockDiffList;
}

export default generateStockDiffList;