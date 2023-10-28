import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import { getPaymentTransaction, paymentRelease } from "../../models/DB/Payment";
import getOrderItems from "../../models/Order/getOrderItems";
import userRecordLock from "../../models/Payment/kosenPayRecordLock";
import kousenpayRegist from "../../models/Payment/kosenPayRegist";
import journalRegist from "../Journal/journalRegist";
import paymentTableRegist from "../../models/Payment/paymentTableRegist";
import paidFlag from "../../models/Order/paidFlag";

/**
 * KosenPay決済 取扱の記録
 * @param {{
*  order_number: number,
*  order_id_list: Array<String>,
*  journal_id: string,
*  registered_user: string,
*  r_session_id: string,
* }} register_data セッション情報等
* @param {{
*  user_id: string,
*  is_returned: boolean,
* }} 金銭扱い
* @returns {Promise<{
*  order_number: number,
*  journal_id: string,
* }>} 成功した場合、注文番号とジャーナルIDを返す
*/


const kosenPayPaymentTransaction = ({
    order_number,
    order_id_list,
    journal_id,
    registered_user,
    r_session_id
}, {user_id, is_returned = false}) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションを取得
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return ;
        }

        const paymentTransaction = await getPaymentTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (paymentTransaction === false) {
            await release(transaction);
            return ;
        }

        try {
            // ジャーナルが登録されていない場合は登録する
            if (journal_id == null) {
                const id_data = await journalRegist({
                    order_number,
                    journal_type: 0,
                    store_id: "null",
                    registered_user,
                    r_session_id,
                    order_id_list,
                }, transaction).catch((err) => {
                    throw err;
                });

                order_number = id_data.order_number;
                journal_id = id_data.journal_id;
            }

            // 金額等を取得
            const orderItems = await getOrderItems(order_id_list, transaction).catch((err) => {
                throw err;
            });

            var amount = orderItems.reduce((prev, current) => {
                if (current.deleted) {
                    return prev;
                }

                return prev + (current.unit_price * current.quantity);
            }, 0);

            if (is_returned) {
                amount *= -1;
            }


            // 台帳テーブルに記録
            const payment_id = await paymentTableRegist({
                r_session_id,
                journal_id,
                payment_type: 2,
                amount,
            }, transaction).catch((err) => {
                throw err;
            });

            // ユーザーのレコードをロック
            await userRecordLock(user_id, paymentTransaction).catch((err) => {
                throw err;
            });

            // 決済を実行
            const result = await kousenpayRegist({
                amount: (amount * -1),
                payment_id,
                type: 2,
                user_id,
            }, paymentTransaction).catch((err) => {
                throw err;
            });

            // 決済に失敗した場合
            if (result.result === false) {
                await rollback(transaction);
                await rollback(paymentTransaction);

                resolve(result);
                return;
            }

            // paidフラグを立てる
            await paidFlag(order_id_list, transaction).catch((err) => {
                throw err;
            });

            // コミット
            await commit(paymentTransaction).catch((err) => {
                throw err;
            });
            await commit(transaction).catch((err) => {
                throw err;
            });

            resolve({
                order_number,
                journal_id,
                ...result,
            });
        }catch(e) {
            console.log(e);
            await rollback(transaction);
            await rollback(paymentTransaction);

            reject(e);
        }finally {
            await release(transaction);
            await paymentRelease(paymentTransaction).catch((err) => {
                console.log(err);
            });
        }
    });
}

export default kosenPayPaymentTransaction;