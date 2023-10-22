import { query } from "../DB/DB";



const getOrderHeaderData = async (order_id, transaction) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await query(
                "SELECT * FROM `ORDER_HEADERS` WHERE `order_id` = ?;",
                [order_id],
                transaction
            ).catch((e) => {
                throw e;
            });

            if (res.length === 0) {
                resolve({
                    order_id: null,
                    order_date: null,
                    paid: false,
                    void: false,
                    submited: false,
                    stock_save: false,
                });
            }

            const order_header = res[0];

            resolve({
                order_id: order_header.order_id,
                order_date: order_header.order_date,
                paid: Boolean(order_header.paid),
                void: Boolean(order_header.void),
                submited: Boolean(order_header.submited),
                stock_save: Boolean(order_header.stock_save),
            });

        }catch(e) {
            reject(e);
        }
    });
}

export default getOrderHeaderData;