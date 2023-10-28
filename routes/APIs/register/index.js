import { Router } from "express";
import getStatus from "../../../controllers/api_v1/register/getStatus";
import startRegisterSession from "../../../controllers/api_v1/register/startSession";
import cashBarancePOST from "../../../controllers/api_v1/register/cashBranceRegist";
import getRegistProductData from "../../../controllers/api_v1/register/getRegistProductData";
import orderItemsSessionSave from "../../../controllers/api_v1/register/orderItemsSessionSave";
import registeredUserLoginCtl from "../../../controllers/api_v1/register/registeredUserLogin";
import registeredUserLogoutCtl from "../../../controllers/api_v1/register/registeredUserLogout";
import orderRegistCtl from "../../../controllers/api_v1/register/orderRegist";
import getOrderItemsCtl from "../../../controllers/api_v1/register/getOrderItems";
import payment from "./payment";
import orderMargeCtl from "../../../controllers/api_v1/register/orderMarge";
import orderResetCtl from "../../../controllers/api_v1/register/orderReset";
import getOrderItemsFromNumber from "../../../controllers/api_v1/register/getOrderItemsFromNumber";
const router = Router();

/**
 * ステータスの取得
 */
router.get("/getStatus", getStatus);

/**
 * セッションの開始
 */
router.post("/sessionStart", startRegisterSession);

/**
 * 登録者の登録
 */
router.post("/registeredUserLogin", registeredUserLoginCtl);
router.post("/registeredUserLogout", registeredUserLogoutCtl);

/**
 * 在高登録
 */
router.post("/cashBalance", cashBarancePOST);    // 登録

/**
 * 商品情報取得・セッションに登録
 */
router.post("/getRegistProductData", getRegistProductData);

/**
 * セッションに注文情報を保存
 */
router.post("/orderItemsSessionSave", orderItemsSessionSave);

/**
 * 注文の登録
 */
router.post("/orderItemsRegist", orderRegistCtl);

/**
 * 注文情報の取得
 */
router.get("/getOrderItems", getOrderItemsCtl);

/**
 * 注文のマージ
 */
router.post("/orderMarge", orderMargeCtl);

/**
 * 注文取り消し
 */
router.post("/orderCancel", orderResetCtl);

/**
 * 注文番号から商品情報を取得
 */
router.post("/orderDataGet", getOrderItemsFromNumber);


/**
 * 現金支払い登録
 */
router.use("/payment", payment);

export default router;