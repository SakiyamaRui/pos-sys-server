import sysConf from "../../config/service"
import {
    getTransaction,
    commit,
    rollback,
    release,
} from "../../models/DB/DB";
import productMasterTableRegist from "../../models/Product/masterRegist";
import productDetailTableRegist from "../../models/Product/detailRegist";
import { makerIdSyntaxCheck, productIdCheck, productNameCheck, productPriceCheck } from "../../helpers/checker/productDataChecker";

/**
 * 商品の登録
 * @param {{
 *  product_name: string,
 *  product_id: string,
 *  price: number,
 *  reception: boolean,
 *  stock_check: reception,
 *  maker_id: string
 * }} product_data 商品の情報
 * @returns {Promise<String>} 成功した場合は新しい商品のUUIDを返す
 */
const productRegist = ({
    product_name,
    product_id = null,
    price,
    reception = true,
    stock_check = null,
    maker_id = null,
}) => {
    return new Promise(async (resolve, reject) => {
        // 各種情報の確認

        // 商品ID
        if (!productIdCheck(product_id)) {
            reject(new Error("product_id is syntax error"));
        }

        // 商品名
        if (!productNameCheck(product_name)) {
            reject(new Error("product_name is syntax error"));
        }

        // 価格
        if (!productPriceCheck(price)) {
            reject(new Error("price is out of range"));
        }

        // メーカーID
        if (!makerIdSyntaxCheck(maker_id)) {
            reject(new Error("maker_id is syntax error"));
        }


        /**
         * 在庫記録等の確認
         */
        if (typeof stock_check != "boolean") {
            if (sysConf.stock.record) {
                stock_check = true;
            }else {
                stock_check = false;
            }
        }

        /**
         * 商品の受付ステータス
         */
        if (typeof reception != "boolean") {
            reception = true;
        }



        /**
         * トランザクションの開始
         */
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (!transaction) {
            return false;
        }

        try {
            // マスターテーブルへ登録
            const product_uuid = await productMasterTableRegist({
                product_id,
                product_name,
                price,
                reception,
                stock_check,
            }, transaction).catch((err) => {
                return err;
            });


            // 返された値が文字列でない場合はthrow
            if (typeof product_uuid != "string") {
                throw product_uuid;
            }

            // 詳細テーブルへ登録
            let detailTableInsertResult = await productDetailTableRegist({
                product_uuid,
                maker_id,
            }, transaction).catch((err) => {
                return err;
            });


            // 返された値が真偽値でない場合はthrow
            if (typeof detailTableInsertResult != "boolean") {
                throw detailTableInsertResult;
            }

            // コミット
            let commitResult = await commit(transaction).catch((err) => {
                return err;
            });

            if (commitResult === true) {
                // すべての処理が完了してUUIDを返す
                resolve(product_uuid);
            }else{
                if (typeof commitResult == "object") throw commitResult;
                else throw new Error("transaction commit error");
            }

        }catch (e) {
            await rollback(transaction).catch((err) => {
                console.log("Rollback Error");
                reject(err);
            });

            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default productRegist;