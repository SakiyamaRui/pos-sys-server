
import registeredUserLogin from "../../../middlewares/Register/RegisteredUserSession/sessionLogin";


/**
 * 登録ユーザーのログイン処理のエンドポイント
 * @param {Object} req 
 * @param {Object} res 
 */
const registeredUserLoginCtl = async (req, res) => {
    
    try {
        // user_idの取得
        const user_id = req.body.user_id;

        // DBに保存
        let sessionData = await registeredUserLogin(
            user_id,
            req.session.data.sessionId
        ).catch(err => {
            throw err;
        });

        // セッションに保存
        req.session.data.registeredUser = [{
            user_id: user_id,
            log_id: sessionData.log_id,
        }];

        res.send({
            message: "OK",
            data: {
                log_id: sessionData.log_id,
                user_id: user_id,
            }
        });

    }catch(e) {
        res.status(500).send({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default registeredUserLoginCtl;