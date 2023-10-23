import getOrderDetails from "../../../middlewares/Order/getOrderData";


const orderMargeCtl = async (req, res) => {
    try {
        const order_id = req.body.order_id;

        //
        var {
            order_items,
            paid,
        } = await getOrderDetails(order_id).catch((err) => {
            throw err;
        });

        if (paid) {
            res.send({
                response: "error",
                message: "既に支払いが完了しています。",
            });
            return ;
        }

        order_items = order_items.filter(elm => {
            return elm.deleted == false && !req.session.data.registItems.find((elm2) => elm.order_line_id === elm2.order_line_id);
        }).map((elm) => {
            return {
                ...elm,
                price: elm.unit_price,
                quantity: elm.quantity,
            }
        })

        req.session.data.registItems = [...req.session.data.registItems, ...order_items];
        req.session.data.orderIdList = [...req.session.data.orderIdList, order_id]

        res.send({
            response: "OK",
            message: "注文をマージしました。",
            order_items: req.session.data.registItems,
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            response: "error",
            status: 500,
            message: "Internal Server Error",
            error: e.message,
        });
    }finally{
        res.end()
    }
}

export default orderMargeCtl;