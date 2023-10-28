import getOrderDataFromOrderNumber from '../../../middlewares/Order/getOrderDataFromOrderNumber';


const getOrderItemsFromNumber = async (req, res) => {
    //
    const currentDate = new Date();
    // const orderDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const orderDate = "2023-10-27";

    getOrderDataFromOrderNumber(orderDate, req.body.order_number).then((data) => {
        res.json({
            order_items: data,
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    });
}

export default getOrderItemsFromNumber;