import getOrderDetails from "../../../middlewares/Order/getOrderData";


const getOrderDataCtl = async (req, res) => {
    try {
        //
        const order_data = await getOrderDetails(req.params.order_id).catch((err) => {
            throw err;
        });

        res.json({
            response: "OK",
            data: order_data,
        });
    }catch(e) {
        res.status(500).send({
            responce: "error",
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default getOrderDataCtl;