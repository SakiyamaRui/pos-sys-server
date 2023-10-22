import getOrderItemsList from "../../../middlewares/Order/getOrderItemsList";


 
const getOrderItemsCtl = async (req, res) => {
    try {
        const itemList = await getOrderItemsList(
            req.session.data.orderIdList
        ).catch(err => {
            throw err;
        });

        res.json({
            order_items: itemList,
        });
    }catch(e) {
        res.status(500).send({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default getOrderItemsCtl