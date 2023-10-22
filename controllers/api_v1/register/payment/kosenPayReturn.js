import kosenPayReturnRegist from "../../../../middlewares/Payment/kosenPayReturn";


const kosenPayReturnCtl = async (req, res) => {

    try {
        const r_session_id = req.session.data.sessionId;
        const user_id = req.body.user_id;

        const result = await kosenPayReturnRegist({
            r_session_id,
            user_id
        }).catch((err) => {
            throw err;
        });

        res.json({
            ...result,
        })
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

export default kosenPayReturnCtl;