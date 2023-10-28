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

router.post('/productRegist', async (req, res) => {
  let result = await productRegist({
      product_name: req.body.product_name,
      product_id: req.body.product_id,
      price: req.body.price,
      reception: true,
      stock_check: false,
    }).catch(err => {
      console.log(err);
      return false;
    });

    res.send(result);
})

module.exports = router;
