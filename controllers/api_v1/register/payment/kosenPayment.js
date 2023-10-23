import orderSessionReset from "../../../../helpers/session/orderSessionReset";
import kosenPayPaymentTransaction from "../../../../middlewares/Payment/kosenPaymentTransaction";

const kosenPayPaymentCtl = async (req, res) => {
    try {
        // 各種情報
        const r_session_id = req.session?.data?.sessionId || "order-sys";
        const order_number = req.session?.data?.orderNumber || undefined;
        const journal_id = req.session?.data?.journalId || undefined;
        const registered_user = req.session?.data?.registeredUser[0]?.log_id || "order-sys";
        const order_id_list = req.session?.data?.orderIdList || req.body.order_id_list;

        console.log(req.body)

        // const user_id = req.body?.user_id || null;
        const user_id = "test";

        if (user_id === null) {
            throw new Error("user_id is null");
        }

        // データベースに登録
        const paymentResults = await kosenPayPaymentTransaction({
            order_number,
            order_id_list,
            journal_id,
            registered_user,
            r_session_id,
        }, {
            user_id: user_id,
            is_returned: false,
        }).catch((e) => {
            throw e;
        });

        if (result.false) {
            res.json({
                ...paymentResults,
            });
            return false;
        }

        // セッションにIDの保存
        try {
            req.session.data.orderNumber = paymentResults.order_number;
            req.session.data.journalId = paymentResults.journal_id;

            // 注文セッションのリセット
            orderSessionReset(req.session);
        }catch(e){}

        res.json({
            ...paymentResults,
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            response: "error",
            status: 500,
            message: "Internal Server Error",
            error: e.message,
        });
    }finally{
        res.end();
    }
}

export default kosenPayPaymentCtl;