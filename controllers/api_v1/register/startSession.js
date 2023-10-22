import sessionTemplate from "../../../helpers/session/sessionTemplate";
import registerSessionStart from "../../../middlewares/Register/Session/registerSessionStart";


const startRegisterSession = async (req, res) => {
    try {
        // レジセッションの開始
        let sessionData = await registerSessionStart(
            req.body.store_id,
            req.body.fingerprint,
        ).catch((err) => {
            throw err;
        });

        // セッションIDをcookieに保存
        res.cookie("r_sess_id", sessionData.r_session_id, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1週間
            sameSite: "lax",
        });

        // セッションに保存

        if (!req.session.data) {
            req.session.data = sessionTemplate();
        }

        req.session.data.isOpened = true;
        req.session.data.registerNumber = sessionData.register_number;
        req.session.data.sessionId = sessionData.r_session_id;
        req.session.data.isFirstCashBalanceRegist = false;
        req.session.data.registeredUser = [];

        res.json({
            message: "OK",
            data: {
                r_session_id: sessionData.r_session_id,
                register_number: sessionData.register_number,
            },
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default startRegisterSession;