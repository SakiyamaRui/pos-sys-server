import orderRegist from "../../../middlewares/Order/orderRegist";

const orderRegistCtl = async (req, res) => {
    try {
        // 注文情報
        let orderItems = JSON.parse(req.body.order_items);

        // 注文の登録
        let orderData = await orderRegist(orderItems).catch(err => {
            throw err;
        });

        // セッションに情報の保存
        req.session.data.registItems = orderData.order_items;
        req.session.data.orderIdList = orderData.order_id_list;


        // レスポンスの送信
        res.json({
            order_items: orderData.order_items,
            order_id_list: orderData.order_id_list,
        });
    }catch(e) {
        console.log(e)
        if (e.message == "empty_item") {
            res.status(405).json({
                message: "在庫が不足しています",
                data: e.data,
            });
            return false;
        }

        res.status(500).send({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally{
        res.end();
    }
}

export default orderRegistCtl;