import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import paymentTableRegist from "../../models/Payment/paymentTableRegist";
import journalRegist from "../Journal/journalRegist";
import paidFlag from "../../models/Order/paidFlag";


/**
 * 現金決済 取扱の記録
 * @param {{
 *  order_number: number,
 *  order_id_list: Array<String>,
 *  journal_id: string,
 *  registered_user: string,
 *  r_session_id: string,
 * }} register_data セッション情報等
 * @param {{
 *  recieved: number,
 *  change: number,
 * }} 金銭扱い
 * @returns {Promise<{
 *  order_number: number,
 *  journal_id: string,
 * }>} 成功した場合、注文番号とジャーナルIDを返す
 */
const cashPaymentTransaction = ({
    order_number = null,
    order_id_list = [],
    journal_id = null,
    registered_user,
    r_session_id,
}, {
    // 預かり
    recieved,
    // お釣り
    change = 0,
}) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの取得
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });
        
        if (transaction === false) {
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

            // 台帳テーブルに記録
            await paymentTableRegist({
                r_session_id,
                journal_id,
                payment_type: 0,
                amount: recieved,
            }, transaction).catch((err) => {
                throw err;
            });

            
            // お釣りがある場合は台帳テーブルに記録
            if (change > 0) {
                await paymentTableRegist({
                    r_session_id,
                    journal_id,
                    payment_type: 1,
                    amount: change,
                }, transaction).catch((err) => {
                    throw err;
                });
            }

            // paidフラグを立てる
            await paidFlag(order_id_list, transaction).catch((err) => {
                throw err;
            });

            await commit(transaction).catch((err) => {
                throw err;
            });

            resolve({
                order_number,
                journal_id,
            });

        }catch(e) {
            await rollback(transaction).catch((err) => {
                console.log(err);
            });
            reject(e);
        }finally {
            await release(transaction);
        }
    });
}


export default cashPaymentTransaction;