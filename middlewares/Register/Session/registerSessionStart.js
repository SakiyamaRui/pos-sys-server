import { commit, getTransaction, release, rollback } from "../../../models/DB/DB"
import storeRegisterSesssionLock from "../../../models/Register/storeRegisterSessionLock";
import registerSessionTableRegist from "../../../models/Register/registerSessionRegist";


/**
 * レジのセッションを開始する
 * @param {string} store_id 店舗識別子
 * @param {string} fingerprint 端末のフィンガープリント
 * @returns {Promise<Object>} 成功した場合、セッション情報を返す
 */
const registerSessionStart = (
    store_id = null,
    fingerprint = null,
) => {
    return new Promise(async (resolve, reject) => {
        const transaction = await getTransaction().catch((err) => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return;
        }

        try {
            // 同店舗の行をすべてロック
            await storeRegisterSesssionLock(store_id, transaction).catch((err) => {
                throw err;
            });

            // セッション情報を登録
            let sessionData = await registerSessionTableRegist({
                store_id,
                fingerprint,
            }, transaction).catch((err) => {
                throw err;
            });

            // コミット
            await commit(transaction).catch((err) => {
                throw err;
            });

            // セッション情報を返す
            resolve(sessionData);
        }catch(e){
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    })
}

export default registerSessionStart;