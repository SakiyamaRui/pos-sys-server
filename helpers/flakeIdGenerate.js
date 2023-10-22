const FlakeId = require("flakeid");

export default new FlakeId({
    // 機種ID
    mid: 1,
    // time offlet
    // 現在の時間からオフセット分を引く
    timeOffset: ((2022 - 1970) * 31536000 * 1000) + 25056000 * 1000,
});