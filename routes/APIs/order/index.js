import { Router } from "express";
import orderSysOrderRegistCtl from "../../../controllers/api_v1/order_sys/orderRegist";
import getOrderDataCtl from "../../../controllers/api_v1/order_sys/getOrderData";
var router = Router();

router.post("/regist", orderSysOrderRegistCtl);


router.get("/:order_id", getOrderDataCtl);

export default router;