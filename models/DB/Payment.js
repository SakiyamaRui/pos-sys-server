import { createPool, Connection } from "mysql";
import DB_CONFIG from "../../config/DB";
import { beginTransaction } from "./DB";

/**
 * DBプールの作成
 */
try {
    const CONF = DB_CONFIG.payment[process.env.NODE_ENV];

    var dbPool = createPool({
        // DBホスト名
        host: CONF.host,
        // DBポート
        port: CONF.port || undefined,
        // DBユーザー名
        user: CONF.user,
        // DBパスワード
        password: CONF.password || "",
        // DB名
        database: CONF.database,
        // タイムゾーン
        timezone: CONF.timezone || "jst",
        // 文字コード
        charset: CONF.charset || "utf8",
        // コネクション数
        connectionLimit: CONF.connectionLimit || 5,
    });
}catch (e) {
    console.log("DBコネクションの作成に失敗しました");
    console.log(e);
}

/**
 * DBコネクションの取得
 * @param connection {Connection|null} paramにconnectionが渡されている場合はそのコネクションを返す。nullもしくは値を入れていない場合はコネクションを確立して返す。
 * @returns {Promise<Connection|Error>} 成功した場合はコネクションを返す
 */
const getPaymentConnection = (connection = null) => {

    return new Promise((resolve, reject) => {
        if (connection != null) {
            resolve(connection);
            return false;
        }
        
        try {
            dbPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }

                resolve(connection);
            });
        }catch (e) {
            if (process.env.NODE_ENV === 'env') {
                console.log(e);
            }

            reject(e);
        }
    });
}


/**
 * コネクションを取得し、トランザクションを開始する
 * @param connection {Connection} DBのコネクション
 * @returns {Promise<Connection|Error>} connectionの場合は、取得・開始済
 */
const getPaymentTransaction = (connection) => {
    return new Promise(async (resolve, reject) => {
        //
        let newConnection = await getPaymentConnection(connection).catch((err) => {
            reject(err);
        });

        if (typeof newConnection !== 'undefined') {
            let result = await beginTransaction(newConnection).catch((err) => {
                reject(err);
            });

            if (result) {
                resolve(newConnection);
            }
        }
    });
}


export {
    getPaymentConnection,
    getPaymentTransaction,
}