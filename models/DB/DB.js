import { createPool, Connection } from "mysql";
import DB_CONFIG from "../../config/DB";

/**
 * DBプールの作成
 */
try {
    const CONF = DB_CONFIG[process.env.NODE_ENV];

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
const getConnection = (connection = null) => {

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
 * トランザクションを開始する
 * @param connection {Connection} DBのコネクション
 * @returns {Promise<boolean|Error>} trueの場合はトランザクションの開始。undefinedの場合はエラー
 */
const beginTransaction = (connection) => {
    return new Promise((resolve, reject) => {
        try {
            connection.beginTransaction((err, results) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
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
const getTransaction = (connection) => {
    return new Promise(async (resolve, reject) => {
        //
        let newConnection = await getConnection(connection).catch((err) => {
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


/**
 * SQLクエリの実行
 * @param sql {String} SQL文
 * @param param {Array} プレースホルダーの値
 * @param connection {Connection} DBへのコネクション
 * @returns {Promise<Object|Error>} 成功した場合は結果を返す
 */
const query = (sql, param, connection) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(sql, param, (err, results) => {
                if (err) {
                    reject(err);
                }

                resolve(results);
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
 * コミットの実行
 * @param connection {Connection} DBコネクション
 * @returns {Promise<boolean|Error>} コミットの結果もしくはエラーを返す
 */
const commit = (connection) => {
    return new Promise((resolve, reject) => {
        try {
            connection.commit((err, result) => {
                if (err) {
                    reject(err);
                }
    
                resolve(true);
            });
        }catch (e) {
            reject(e);
        }
    });
}


/**
 * ロールバックの実行
 * @param connection {Connection} DBコネクション
 * @returns {Promise<boolean|Error>} ロールバックの結果もしくはエラーを返す
 */
const rollback = (connection) => {
    return new Promise((resolve, reject) => {
        try {
            connection.rollback((err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        }catch (e) {
            reject(e);
        }
    });
}


/**
 * コネクションの開放
 * @param connection {Connection} DBコネクション
 */
const release = async (connection) => {
    try {
        await connection.release();

        if (dbPool._freeConnections.indexOf(connection) == -1) {
            console.log("Not Release Connection");
        }
    }catch (e) {
        console.log(e);
    }
}



export {
    getConnection,
    beginTransaction,
    getTransaction,
    query,
    commit,
    rollback,
    release
}