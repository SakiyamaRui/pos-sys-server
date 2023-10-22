import { getTransaction, release, rollback } from "../../models/DB/DB";
import getProductMasterData from "../../models/Product/getProductMasterData";


/**
 * 商品データの取得
 * @param {{
 *  product_id: String,
 *  product_uuid: String,
 * }} 商品インデックスデータ
 * @returns {Promise<Object>} 商品データ
 */
const getProductData = ({
    product_id,
    product_uuid,
}) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの取得
        const transaction = await getTransaction().catch(err => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return ;
        }

        try {
            let product_data = await getProductMasterData({
                product_id,
                product_uuid,
            }, transaction).catch(err => {
                throw err;
            });

            resolve(product_data);
        }catch(e) {
            rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default getProductData;