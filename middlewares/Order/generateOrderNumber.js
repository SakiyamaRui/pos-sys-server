import getNewOrderNumber from "../../models/Order/getNewOrderNumber";
import orderLinkRegist from "../../models/Order/orderLinkRegist";


const generateOrderNumber = async ({
    order_id_list,
    store_id = "null",
}, transaction) => {
    //
    try {
        // 注文番号の取得
        let order_number = await getNewOrderNumber(store_id, transaction).catch((err) => {
            throw err;
        });

        // 注文番号と注文IDの紐付け
        for (let key in order_id_list) {
            await orderLinkRegist({
                order_id: order_id_list[key],
                store_id,
                order_number,
            }, transaction).catch((err) => {
                throw err;
            });
        }

        return order_number;
    }catch(e) {
        throw e;
    }
}

export default generateOrderNumber;