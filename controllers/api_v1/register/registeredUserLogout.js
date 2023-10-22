
import registeredUserLogout from "../../../middlewares/Register/RegisteredUserSession/sessionLogout";


const registeredUserLogoutCtl = async (req, res) => {
    try {
        // ログアウト処理
        await registeredUserLogout(
            req.session.data.registeredUser[0].log_id,
        ).catch(err => {
            throw err;
        });

        // セッションから削除
        req.session.data.registeredUser = [];

        res.json({
            message: "Logout Success",
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

export default registeredUserLogoutCtl;