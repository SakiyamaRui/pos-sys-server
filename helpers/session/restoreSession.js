
import getSessionData from "../../middlewares/Register/Session/getSessionData";

const restoreSession = (r_session_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // セッション情報を取得
            let sessionData = await getSessionData(r_session_id).catch((err) => {
                throw err;
            });

            resolve(sessionData);
        }catch(err) {
            reject(err);
        }
    });
}

export default restoreSession;