import { query } from "../DB/DB";


const getListOrderLinks = (order_id, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            //

            const order_data = await query(
                "SELECT * FROM `ORDER_NUMBERS` WHERE `order_id` = ?",
                [order_id],
                transaction
            ).catch((err) => {
                throw err
            });

            if (order_data.length === 0) {
                resolve(undefined);
            }

            var {
                store_id,
                order_date,
                order_number,
            } = order_data[0];

            const order_id_list = await query(
                "SELECT * FROM `ORDER_NUMBERS` WHERE `store_id` = ? AND `order_date` = ? AND `order_number` = ? AND `deleted` = 0;",
                [store_id, order_date, order_number],
                transaction
            ).catch((err) => {
                throw err;
            });

            if (order_id_list.length === 0) {
                resolve(undefined);
            }


            resolve(order_id_list);
        }catch(e) {
            reject(e);
        }
    });
}

export default getListOrderLinks;