

const orderItemsSessionSave = (req, res) => {
    try {
        req.session.data.registItems = JSON.parse(req.body.order_items);

        res.json(req.session.data.registItems);
    }catch(e) {
        res.status(500).send({
            message: "Internal Server Error",
            error: e.message,
        });
    }finally {
        res.end();
    }
}

export default orderItemsSessionSave;