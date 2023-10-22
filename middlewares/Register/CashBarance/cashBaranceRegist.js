import { commit, getTransaction, release, rollback } from "../../../models/DB/DB";
import getRegisterSessionData from "../../../models/Register/getRegisterSessionData";
import registCashBaranceTable from "../../../models/Register/registCashBaranceTable";
import updateFirstCashBalance from "../../../models/Register/updateFirstCashBalance";


/**
 * 金種別在高登録を行う
 * @param {String} r_session_id レジセッションID
 * @param {String} user_id 登録ユーザーID
 * @param {Array} data 金種別在高データ
 * @returns {Promise<boolean>}
 */
const cashBaranceRegist = (
    r_session_id,
    user_id,
    data
) => {
    return new Promise(async (resolve, reject) => {
        // トランザクションの取得
        let transaction = await getTransaction().catch(err => {
            reject(err);
            return false;
        });

        if (transaction === false) {
            return ;
        }

        try {
            // レジのセッション情報の取得
            let sessions = await getRegisterSessionData(r_session_id, transaction).catch(err => {
                throw err;
            });

            if (sessions.length === 0) {
                throw new Error("session is not found");
            }

            // DBに登録
            await registCashBaranceTable({
                r_session_id,
                user_id,
                data
            }, transaction).catch(err => {
                throw err;
            });

            // セッションの初回在高登録がまだの場合は更新
            if (sessions[0].first_cash_balance == 0) {
                // 初回在高登録フラグを更新
                await updateFirstCashBalance(r_session_id, true, transaction).catch(err => {
                    throw err;
                });
            }

            // コミット
            await commit(transaction).catch((err) => {
                throw err;
            });

            resolve(true);
        }catch(e) {
            await rollback(transaction);
            reject(e);
        }finally{
            await release(transaction);
        }
    });
}

export default cashBaranceRegist;