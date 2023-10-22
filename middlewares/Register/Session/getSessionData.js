import { getTransaction, release, rollback } from "../../../models/DB/DB";
import checkRegisterSession from "../../../models/Register/checkRegisterSession";
import getOnlineRegisteredUser from "../../../models/Register/getOnlineRegisteredUser";

/**
 * セッション情報の取得
 * @param {String} r_session_id レジセッションID
 * @returns {Promise<>}
 */
const getSessionData = (r_session_id) => {
    return new Promise(async (resolve, reject) => {
        // コネクションの取得
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return ;
        }

        try {
            // セッション情報の取得
            let result = await checkRegisterSession({
                r_session_id: r_session_id,
            }).catch((err) => {
                throw err;
            });

            if (result === false) {
                throw new Error("セッションが見つかりませんでした");
            }

            let data = result[0];

            // 登録者の取得
            let registeredUser = await getOnlineRegisteredUser(
                r_session_id,
                transaction
            ).catch((err) => {
                throw err;
            });

            resolve({
                // 開局フラグ
                isOpened: true,
                // レジ番号
                registerNumber: data.register_number,
                // 初回在高登録
                isFirstCashBalanceRegist: Boolean(data.first_cash_balance),
                // レジユーザー
                registeredUser: registeredUser,
            });
        }catch(err) {
            rollback(transaction);
            reject(err);
        }finally {
            await release(transaction);
        }
    });
}

export default getSessionData;