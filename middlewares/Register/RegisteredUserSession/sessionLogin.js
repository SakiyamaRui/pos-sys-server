import { commit, getTransaction, release, rollback } from "../../../models/DB/DB";
import registeredUserLoginRegist from "../../../models/Register/registeredUserLoginRegist";


/**
 * レジ登録者のログイン登録処理
 * @param {String} user_id ユーザー識別子
 * @param {String} r_session_id レジセッションID
 * @returns {Promise<Object>} セッション情報
 */
const registeredUserLogin = (
    user_id,
    r_session_id
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
            // ログイン登録処理
            let sessionData = await registeredUserLoginRegist(
                user_id,
                r_session_id,
                transaction
            ).catch(err => {
                throw err;
            });

            // コミット
            await commit(transaction).catch(err => {
                throw err;
            });

            // ログイン情報を返す
            resolve(sessionData);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            release(transaction);
        }
    });
}

export default registeredUserLogin;