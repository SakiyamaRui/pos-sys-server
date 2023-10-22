import { Router } from "express";
import cors from "cors";

/**
 * API v1
 */
const api_v1 = Router();

api_v1.use(cors({
    origin: "*",
    credentials: true,
}));

// レジからのリクエスト
// 認証情報の確認
api_v1.use("/register", (req, res, next) => {
    next();
});

// ルーターと接続
import registerRouter from "./APIs/register";
api_v1.use("/register", registerRouter);

import productRouter from "./APIs/product";
api_v1.use("/product", productRouter);

import orderRouter from "./APIs/order";
api_v1.use("/order", orderRouter);


// 公開API
api_v1.use("/public", (req, res, next) => {
    // 署名の確認
    next();
});

export {
    api_v1,
};