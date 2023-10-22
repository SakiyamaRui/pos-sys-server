import orderRegist from "../../../middlewares/Order/orderRegist";


const orderSysOrderRegistCtl = async (req, res) => {
    try {
        //
        const order_item_list = JSON.parse(req.body.order_items);

        const { order_id_list, order_items } = await orderRegist(order_item_list).catch((e) => {
            throw e;
        });

        res.json({
            response: "OK",
            data: {
                order_id_list: order_id_list,
                order_items: order_items,
            }
        })
    }catch(e) {
        res.status(500).json({
            response: "error",
            status: 500,
            message: "Internal Server Error",
            error: e.message,
            list: e.data,
        });
        console.log(e);
    }finally {
        res.end();
    }
}

export default orderSysOrderRegistCtl;