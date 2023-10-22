import kosenPayCharge from "../../../../middlewares/Payment/kosenPayCharge";


const kosenPayChargeCtl = async (req, res) => {
    try {
        //
        const user_id = req.body.user_id || null;
        const amount = Number(req.body.amount) || 0;
        const r_session_id = req.session.data.sessionId;

        if (user_id === null) {
            throw new Error("user_id is null");
        }

        // データベースに登録
        const results = await kosenPayCharge({
            r_session_id,
        },{
            user_id,
            amount
        }).catch((e) => {
            throw e;
        });

        res.json({
            ...results,
        });
    }catch(e) {
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

export default kosenPayChargeCtl;