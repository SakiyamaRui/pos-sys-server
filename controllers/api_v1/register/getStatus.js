import sessionTemplate from "../../../helpers/session/sessionTemplate";
import restoreSession from "../../../helpers/session/restoreSession";

const getStatus = async (req, res) => {

    try {
        if (!req.session.hasOwnProperty("data")) {
            req.session.data = {};
        }
    
        // 開局フラグの確認
        if (!req.session.data.hasOwnProperty("isOpened")) {
            // セッションにレジ情報がない
    
            // セッションにテンプレートを作成
            req.session.data = {
                ...sessionTemplate(),
            };
    
            // cookie内にレジセッション情報があるか確認
            if (Object.keys(req.cookies).length !== 0) {
                if (req.cookies.hasOwnProperty("r_sess_id")) {
                    // セッションIDから復元
                    req.session.data = {
                        ...req.session.data,
                        ...await restoreSession(req.cookies.r_sess_id).catch((err) => {
                            throw err;
                        }),
                    }
                }
            }
        }else{
            //　セッションデータのアップデート
        }
    
    
        // cookie情報を除いてデータを送信
        res.json(req.session.data);
    }catch(err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export default getStatus;