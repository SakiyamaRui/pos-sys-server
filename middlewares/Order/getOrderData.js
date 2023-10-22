import { getTransaction, release, rollback } from "../../models/DB/DB";
import getListOrderLinks from "../../models/Order/getListOrderLinks";
import getOrderHeaderData from "../../models/Order/getOrderHeaderData";
import getOrderItems from "../../models/Order/getOrderItems";


const getOrderDetails = async (
    order_id
) => {
    return new Promise(async (resolve, reject) => {
        //
        const transaction = await getTransaction().catch(e => {
            reject(e);
            return false;
        });

        if (!transaction) {
            return ;
        }

        try {
            // 注文情報の取得
            var order_list = (await getListOrderLinks(order_id, transaction).catch((e) => {
                throw e;
            })) || null;

            // 注文ヘッダーの取得
            const order_header = await getOrderHeaderData(order_id, transaction).catch((e) => {
                throw e;
            });

            var order_number = null;
            if (order_list !== null) {
                order_number = order_list[0].order_number;
            }else{
                order_list = [{order_id}];
            }

            // 各商品の情報を取得
            const order_items = await getOrderItems(order_list.map((elm) => elm.order_id), transaction).catch((e) => {
                throw e;
            });

            resolve({
                order_number: order_number,
                order_items: order_items,
                order_id: order_id,
                ...order_header,
            });
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default getOrderDetails;