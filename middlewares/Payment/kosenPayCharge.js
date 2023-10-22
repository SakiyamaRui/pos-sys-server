import { commit, getTransaction, release, rollback } from "../../models/DB/DB";
import { getPaymentTransaction } from "../../models/DB/Payment";
import kousenpayRegist from "../../models/Payment/kosenPayRegist";
import paymentTableRegist from "../../models/Payment/paymentTableRegist";


const kosenPayCharge = ({
    r_session_id,
},{
    user_id,
    amount
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

            // 決済番号の発行
            const payment_id = await paymentTableRegist({
                r_session_id,
                journal_id: "",
                payment_type: 3,
                amount,
            }, transaction).catch((err) => {
                throw err;
            });

            const res = await kousenpayRegist({
                amount,
                payment_id,
                type: 1,
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


            resolve(res);
        }catch(e) {
            console.log(e);
            await rollback(transaction);
            await rollback(paymentTransaction);

            reject(e);
        }finally{
            await release(transaction);
            await release(paymentTransaction);
        }
    });
}

export default kosenPayCharge;