
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
    "product": {
        host: "public.2aji3.tyo1.database-hosting.conoha.io",
        port: 3306,
        user: "2aji3_app",
        password: "Rui-14sei",
        database: "2aji3_pos_sys",
    },
    "payment": {
        "dev": {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "ORDER_SYS",
            charset: "utf8",
        },
        "product": {
            host: "public.2aji3.tyo1.database-hosting.conoha.io",
            port: 3306,
            user: "2aji3_app",
            password: "Rui-14sei",
            database: "2aji3_order_sys",
            charset: "utf8",
        }
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
        "product": {
            host: "public.2aji3.tyo1.database-hosting.conoha.io",
            port: 3306,
            user: "2aji3_session",
            password: "Rui-14sei",
            database: "2aji3_session",
            charset: "utf8",
        }
    },
}