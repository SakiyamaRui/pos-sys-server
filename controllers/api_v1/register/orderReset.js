import orderSessionReset from "../../../helpers/session/orderSessionReset";
import orderStockRelease from "../../../middlewares/Order/orderStockRelease";

const orderResetCtl = async (req, res) => {
    try {
        //
        const order_id_list = req.session.data.orderIdList;

        orderSessionReset(req.session);

        // 在庫の開放
        await orderStockRelease(order_id_list).catch(e => {
            throw e;
        });

        res.json(true);

    }catch(e) {
        console.log(e);
        res.status(500).json(false);
    }finally{
        res.end();
    }
}

export default orderResetCtl;