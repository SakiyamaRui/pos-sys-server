
export default {
    // テスト環境用
    "dev": {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "POS_REGISTER_SYS",
        charset: "utf8",
    },
    // 本番環境用
    "product": {},
    "payment": {
        "dev": {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "ORDER_SYS",
            charset: "utf8",
        },
        "product": {}
    },
    "session": {
        "dev": {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "session_db",
            charset: "utf8",
        },
    },
}