import { getTransaction, release, rollback } from "../../models/DB/DB";
import getOrderItems from "../../models/Order/getOrderItems";


const getOrderItemsList = (
    orderIdList,
    mysql_connection = null
) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの開始
        const transaction = await getTransaction(mysql_connection).catch((err) => {
            reject(err);
            return false;
        });
        
        if (transaction === false) {
            return ;
        }

        try {
            let order_items = await getOrderItems(orderIdList, transaction).catch((err) => {
                throw err;
            });

            resolve(order_items);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally {
            release(transaction);
        }
    });
}

export default getOrderItemsList;