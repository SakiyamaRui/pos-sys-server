import { generateStockIdList } from "../../helpers/generateIdList";
import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import productIsStockRecordCheck from "../../models/Product/productIsStockRecordCheck";
import productStockMasterTableRock from "../../models/Stock/masterTableRock";
import sysConf from "../../config/service";
import orderHeaderTableRegist from "../../models/Order/orderHeaderRegist";
import orderItemTableRegist from "../../models/Order/orderItemRegist";
import orderItemStockSaveReset from "../../models/Order/orderItemStockSaveReset";
import orderItemStockSaveRegist from "../../models/Order/orderItemStockSaveRegist";
import getOrderItems from "../../models/Order/getOrderItems"
import getOrderItemsList from "./getOrderItemsList";


const orderRegist = (
    order_items,
    isForce = false,
) => {
    return new Promise(async (resolve, reject) => {
        // データが0の場合はエラーを返す
        if (order_items.length == 0) {
            reject(new Error("order_items is empty"));
            return;
        }

        // トランザクションの開始
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });
        
        if (transaction === false) {
            return ;
        }

        try {
            // ヘッダーが登録されてない商品があればヘッダーの作成
            let order_id = null;
            if (order_items.some((elm) => elm.order_id == null)) {
                order_id = await orderHeaderTableRegist({
                    isPaid: false,
                    isStockSave: true,
                }, transaction).catch((err) => {
                    throw err;
                });
            }

            // order_id_listの作成
            let order_id_list = [];
            let registed_order_id_list = [];
            if (order_id) order_id_list.push(order_id);
            order_items.forEach(elm => {
                if (elm.order_id) {
                    if (!registed_order_id_list.includes(elm.order_id)) registed_order_id_list.push(elm.order_id);
                }
            });
            
            //　結合
            order_id_list = [...order_id_list, ...registed_order_id_list];

            // 在庫の変更を記録する場合、在庫を一時リセットする
            if (sysConf.stock.record) {
                // 在庫を記録する商品を取得
                let stockChangeProduct = await productIsStockRecordCheck(
                    order_items.map((elm) => elm.product_uuid),
                    transaction
                );

                // リストの生成
                let lockIdList = generateStockIdList(order_items.filter(elm => {
                    return stockChangeProduct.some(item => item.product_uuid == elm.product_uuid);
                }));

                // 変更を行う行をロック
                var productStockList = await productStockMasterTableRock(
                    lockIdList.data,
                    lockIdList.type,
                    transaction
                ).catch((err) => {
                    throw err;
                });

                if (registed_order_id_list.length > 0){
                    // 在庫情報をリセットする
                    var beforStockData = await orderItemStockSaveReset(
                        registed_order_id_list,
                        transaction
                    ).catch((err) => {
                        throw err;
                    });
                }
            }

            // 注文商品の登録
            let registedOrderItems = await orderItemTableRegist(
                order_items,
                order_id,
                transaction
            ).catch(err => {
                throw err;
            });

            // 注文情報の取得
            // console.log(await getOrderItems(order_id_list, transaction));

            // 在庫の変更を記録する場合
            if (sysConf.stock.record) {
                if (order_id_list.length > 0) {
                    // 在庫の登録
                    let after_stock = await orderItemStockSaveRegist(order_id_list, transaction).catch((err) => {
                        throw err;
                    });
                }
            }

            await commit(transaction).catch((err) => {
                throw err;
            });

            resolve({
                order_id_list: order_id_list,
                order_items: await getOrderItemsList(order_id_list),
            });
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default orderRegist;