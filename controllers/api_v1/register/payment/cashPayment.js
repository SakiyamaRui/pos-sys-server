import orderSessionReset from "../../../../helpers/session/orderSessionReset";
import cashPaymentTransaction from "../../../../middlewares/Payment/cashPayment";


const cashPaymentCtl = async (req, res) => {
    //
    try {
        // 各種情報
        const r_session_id = req.session.data.sessionId;
        const order_number = req.session.data.orderNumber;
        const journal_id = req.session.data.journalId || undefined;
        const registered_user = req.session.data.registeredUser[0].log_id;
        const order_id_list = req.session.data.orderIdList;

        // 金銭情報
        const recieved = req.body.recieved;
        const change = req.body.change;


        // データベースに登録
        const regist_response = await cashPaymentTransaction({
            order_number,
            order_id_list,
            journal_id,
            registered_user,
            r_session_id,
        }, {
            recieved,
            change
        }).catch((e) => {
            throw e;
        });

        // セッションにIDの保存
        req.session.data.orderNumber = regist_response.order_number;
        req.session.data.journalId = regist_response.journal_id;

        // 注文セッションのリセット
        orderSessionReset(req.session);

        res.json({
            response: "OK",
            data: {
                order_number: regist_response.order_number,
                journal_id: regist_response.journal_id,
            }
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            response: "error",
            status: 500,
        });
    }finally {
        res.end();
    }
}

export default cashPaymentCtl;