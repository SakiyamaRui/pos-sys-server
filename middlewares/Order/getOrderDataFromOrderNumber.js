import { getTransaction, release } from "../../models/DB/DB";
import getOrderIdListFromOrderNumber from "../../models/Order/getOrderIdListFromOrderNumber";
import getOrderItems from "../../models/Order/getOrderItems";


const getOrderDataFromOrderNumber = (
    order_date,
    order_number,
) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await getTransaction().catch(e => {
            reject(e);
            return false;
        });

        if (!transaction) {
            return ;
        }

        try {
            // 商品IDの一覧を取得
            const order_id_list = await getOrderIdListFromOrderNumber(order_date, order_number, transaction).catch((e) => {
                throw e;
            });

            if (order_id_list.length == 0) {
                reject(new Error("order_id_list is empty"));
                return ;
            }

            // 
            const order_items = await getOrderItems(order_id_list, transaction).catch((e) => {
                throw e;
            });

            resolve(order_items);
        }catch(e) {
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default getOrderDataFromOrderNumber;