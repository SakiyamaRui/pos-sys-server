var express = require('express');
var router = express.Router();

import productRegist from "../middlewares/Product/productRegist";

/* GET home page. */
router.get('/test', async (req, res, next) => {
  // テスト

  // let result = await productRegist({
  //   product_name: "つゆぬき",
  //   product_id: "99997",
  //   price: 0,
  //   reception: true,
  //   stock_check: false,
  // }).catch(err => {
  //   console.log(err);
  //   return false;
  // });

  res.send("result");
});

module.exports = router;
