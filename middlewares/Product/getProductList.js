import { getTransaction, release, rollback } from "../../models/DB/DB";
import getProductDataListFromProductId from "../../models/Product/getProductDataList";
import getProductDataListFromProductUuid from "../../models/Product/getProductDataListFromProductUuid";


const getProductDataList = (
    product_id_list = [],
    product_uuid_list = [],
) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (!transaction) {
            return false;
        }
        
        try {
            //
            var result = [];
            if (product_id_list.length > 0) {
                result.push(...(await getProductDataListFromProductId(
                    product_id_list,
                    transaction
                ).catch((err) => {
                    throw err;
                })));
            }

            if (product_uuid_list.length > 0) {
                result.push(...(await getProductDataListFromProductUuid(
                    product_uuid_list,
                    transaction
                ).catch((err) => {
                    throw err;
                })));
            }

            resolve(result.map((record) => {
                return {
                    product_uuid: record.product_uuid,
                    product_id: record.product_id,
                    price: record.price,
                    product_name: record.product_name,
                };
            }));
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally {
            await release(transaction);
        }
    });
}

export default getProductDataList;