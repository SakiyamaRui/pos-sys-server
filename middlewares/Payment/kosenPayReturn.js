import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import { getPaymentTransaction, paymentRelease } from "../../models/DB/Payment";
import kousenpayRegist from "../../models/Payment/kosenPayRegist";
import paymentTableRegist from "../../models/Payment/paymentTableRegist";
import getKosenPayBalance from "../../models/Payment/getKosenPayBalance";
import userRecordLock from "../../models/Payment/kosenPayRecordLock";


const kosenPayReturnRegist = ({
    r_session_id,
    user_id
}) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの取得
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (!transaction) {
            return;
        }

        const paymentTransaction = await getPaymentTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (!paymentTransaction) {
            await release(transaction);
            return;
        }

        try {
            // ロックをかける
            await userRecordLock(user_id, paymentTransaction).catch((err) => {
                throw err;
            });

            // 残高の取得
            const amount = await getKosenPayBalance(user_id, paymentTransaction).catch((err) => {
                throw err;
            });

            if (amount === 0) {
                resolve({
                    response: "OK",
                    return_amount: amount,
                });
            }

            // 決済番号の発行
            const payment_id = await paymentTableRegist({
                r_session_id,
                journal_id: "",
                payment_type: 3,
                amount: (amount * -1),
            }, transaction).catch((err) => {
                throw err;
            });

            const res = await kousenpayRegist({
                amount: (amount * -1),
                payment_id,
                type: 3,
                user_id,
            }, paymentTransaction).catch((err) => {
                throw err;
            });


            await commit(transaction).catch((err) => {
                throw err;
            });

            await commit(paymentTransaction).catch((err) => {
                throw err;
            });


            resolve({
                ...res,
                return_amount: amount,
            });
        }catch(e) {
            console.log(e);
            await rollback(transaction);
            await rollback(paymentTransaction);

            reject(e);
        }finally{
            await release(transaction);
            await paymentRelease(paymentTransaction).catch((err) => {
                console.log(err);
            });
        }
    });
}

export default kosenPayReturnRegist;