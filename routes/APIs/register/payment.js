import { Router } from "express";
import cashPaymentCtl from "../../../controllers/api_v1/register/payment/cashPayment";
import kosenPayPaymentCtl from "../../../controllers/api_v1/register/payment/kosenPayment";
import kosenPayChargeCtl from "../../../controllers/api_v1/register/payment/kosenPayCharge";
import kosenPayReturnCtl from "../../../controllers/api_v1/register/payment/kosenPayReturn";

const router = Router();

router.post("/cashPayment", cashPaymentCtl);

router.post("/kosenPayPayment", kosenPayPaymentCtl);

router.post("/kosenPayCharge", kosenPayChargeCtl);

router.post("/kosenPayReturn", kosenPayReturnCtl);


export default router;