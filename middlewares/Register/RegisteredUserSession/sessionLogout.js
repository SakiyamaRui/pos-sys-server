import { commit, getTransaction, release, rollback } from "../../../models/DB/DB";
import registeredUserLogoutRegist from "../../../models/Register/registeredUserLogoutRegist";

/**
 * レジ登録者のログアウト処理
 * @param {String} log_id レジ登録者のログインログID
 * @returns {Promise<Object>} セッション情報
 */
const registeredUserLogout = (
    log_id
) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの開始
        const transaction = await getTransaction().catch(err => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return ;
        }

        try {
            // ログアウト処理
            let sessionData = await registeredUserLogoutRegist(
                log_id,
                transaction
            ).catch(err => {
                throw err;
            });

            // コミット
            await commit(transaction).catch(err => {
                throw err;
            });

            resolve(sessionData);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            release(transaction);
        }
    });
}

export default registeredUserLogout;