import { query } from "../DB/DB";

const paidFlag = (
    order_id_list,
    transaction
) => {
    return new Promise(async (resolve, reject) => {
        try {

            const placeholder = "?,".repeat(order_id_list.length).slice(0, -1);

            await query(
                "UPDATE `ORDER_HEADERS` SET `paid` = 1 WHERE `order_id` IN (" + placeholder +")",
                order_id_list,
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve(true);
        }catch(e) {
            reject(e);
        }
    });
}

export default paidFlag;