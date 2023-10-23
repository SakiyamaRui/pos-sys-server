import { getTransaction, release, rollback } from '../../models/DB/DB';
import orderItemStockSaveReset from '../../models/Order/orderItemStockSaveReset';


const orderStockRelease = (order_id_list) => {
    return new Promise(async (resolve, reject) => {
        if (order_id_list.length == 0) {
            resolve(true);
            return;
        }

        const transaction = await getTransaction().catch(e => {
            reject(e);
            return false;
        });

        if (!transaction) {
            return;
        }

        try {
            //
            await orderItemStockSaveReset(order_id_list, transaction).catch(e => {
                throw e;
            });

            resolve(true);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default orderStockRelease;