var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import ip from "ip";

// セッション
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// DBオプションの取得
import dbOption from "./config/DB";
const sessionDBOptions = dbOption.session[process.env.NODE_ENV || "dev"];

// MySQLセッションストア
const sessionStore = new MySQLStore(sessionDBOptions);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: "sess_id",
  secret: "secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 24時間
    httpOnly: true,
  }
}));

/**
 * ルーティングファイル
 */
import { api_v1 } from "./routes/api";
import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * ルーティング
 */
app.use("/api/v1", api_v1);
const indexRouter = require("./routes/index");
app.use('/', indexRouter);


app.use('/', createProxyMiddleware({
  target: `http://${ip.address()}:3001`,
  changeOrigin: true,
  secure: false,
  xfwd: true,
  ws: true,
  hostRewrite: true,
  cookieDomainRewrite: true,
  headers: {
    "Connection": "keep-alive",
    "Content-Type": "text/xml;charset=UTF-8",
    "Accept": "*/"
  },
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    response: "error",
    status: err.status || 500,
  });
});


// セッションストアのエラーのキャッチ
sessionStore.onReady().catch(err => {
  console.log("セッションストアの初期化に失敗しました。");
  console.error(err);
});

module.exports = app;
