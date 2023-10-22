import { Router } from "express";
import getProductDataListCtl from "../../../controllers/api_v1/product/getPriceList";
var router = Router();

router.post("/getProductPrice", getProductDataListCtl);

export default router;