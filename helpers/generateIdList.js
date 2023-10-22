
const generateStockIdList = (stockData, store_id = null) => {
    let stock_id = true;
    let stock_id_list = [];
    let product_id_list = [];

    stockData.forEach(elm => {
        if (!elm.hasOwnProperty("stock_id")) {
            stock_id = false;
        }
    
        if (stock_id) {
            stock_id_list.push(elm.stock_id);
        }
    
        if (!elm.product_uuid) {
            throw new Error("this data is format error");
        }
    
        product_id_list.push({
            product_uuid: elm.product_uuid,
            store_id: elm.store_id || store_id,
        });    
    });

    return {
        type: (stock_id)? "stock_id": "product_uuid",
        data: (stock_id)
            ? stock_id_list.filter((elm, i) => stock_id_list.findIndex(item => item.stock_id_list === elm.stock_id_list) === i)
            : product_id_list.filter((elm, i) => product_id_list.findIndex(item => {
                return (
                    item.product_uuid === elm.product_uuid
                    &&
                    item.store_id === elm.store_id
                )
            }) === i),
    }
};

export {
    generateStockIdList,
}