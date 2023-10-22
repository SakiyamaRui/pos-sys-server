

const sessionTemplate = () => {
    return {
        // 開局フラグ
        isOpened: false,
        // 初回在高登録
        isFirstCashBalanceRegist: false,
        // レジ番号
        registerNumber: null,
        // レジ登録者
        registeredUser: [],
        // 登録アイテム
        registItems: [],
        // 注文識別子リスト
        orderIdList: [],
        // 注文番号
        orderNumber: null,
        // ジャーナルID
        journalId: null,
        // ポイントカード等の会員情報
        memberData: {},
        // 直前会計情報
        lastOrder: {
            orderNumber: null,
            journalId: null,
            type: null,
        },
    }
}

export default sessionTemplate;