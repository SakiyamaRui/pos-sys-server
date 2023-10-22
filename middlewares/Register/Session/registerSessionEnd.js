import { commit, getTransaction, release, rollback } from "../../../models/DB/DB";
import registerSessionTableEndRegist from "../../../models/Register/registerSessionEndRegist";


/**
 * レジのセッションを終了する
 * @param {string} r_session_id 終了するセッションID
 * @returns {Promise<Object>} 成功した場合、セッション情報を返す
 */
const registerSessionEnd = (
    r_session_id
) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await getTransaction().catch(err => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return;
        }

        try {
            // セッションを終了する
            let sessionData = await registerSessionTableEndRegist(
                r_session_id,
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
            await release(transaction);
        }
    });
}

export default registerSessionEnd;