import getProductDataList from "../../../middlewares/Product/getProductList";


const getProductDataListCtl = async (req, res) => {
    //
    try {
        const product_id_list = JSON.parse(req.body.product_id_list) || [];
        const product_uuid_list = JSON.parse(req.body.product_uuid_list) || [];

        const productDataList = await getProductDataList(product_id_list, product_uuid_list).catch((err) => {
            throw err;
        });

        res.json({
            response: "OK",
            data: {
                productDataList: productDataList,
            }
        });
    }catch(e) {
        res.status(500).json({
            response: "error",
            status: 500,
            message: "Internal Server Error",
            error: e.message,
        });
        console.log(e);
    }finally {
        res.end();
    }
}

export default getProductDataListCtl;