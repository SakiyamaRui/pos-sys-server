import cashBaranceRegist from "../../../middlewares/Register/CashBarance/cashBaranceRegist"


const cashBarancePOST = async (req, res) => {
    try {
        //
        await cashBaranceRegist(
            req.session.data.sessionId,
            req.body.user_id,
            JSON.parse(req.body.data)
        ).catch((err) => {
            throw err;
        });

        req.session.data.isFirstCashBalanceRegist = true;

        res.json({
            response: "OK",
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

export default cashBarancePOST;