

export default {
    /**
     * システムの挙動タイプ
     * restaurant: レストラン向け
     * retail: 小売店向け
     */
    "type": "restaurant",

    /**
     * 店舗タイプ
     * single: 1店舗
     * multiple: 複数店舗
     */
    "store_type": "single",

    /**
     * 在庫関連
     */
    "stock": {
        // 在庫を記録するか
        "record": true,
        /**
         * 在庫の記録方法
         * quantity_only: 在庫数のみ記録
         * expiration_date: 賞味期限と一緒に管理
         */
        "record_type": "quantity_only",
    },

    /**
     * レジ関連
     */
    "register": {
        // レジパスワード
        //　本番環境ではハッシュ化すること
        "password": "20231028",
    }
}