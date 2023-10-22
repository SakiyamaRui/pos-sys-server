import getProductData from "../../../middlewares/Product/getProductData";

const getRegistProductData = async (req, res) => {
    try {
        // 商品情報の取得
        let product_data = await getProductData({
            product_id: req.body.product_id,
            product_uuid: req.body.product_uuid,
        }).catch(err => {
            throw err;
        });


        // order_data
        const order_data = {
            product_uuid: product_data.product_uuid,
            product_id: product_data.product_id,
            quantity: 1,
            product_name: product_data.product_name,
            price: product_data.price,
            reception: Boolean(product_data.reception),
            deleted: false,
            order_line_id: null,
            order_id: null,
        };

        // セッション内に保存
        req.session.data.registItems.push(order_data);

        // データを返す
        res.json(order_data);
    }catch(e) {
        res.status(500).send({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default getRegistProductData;