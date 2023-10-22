import { query } from "../DB/DB";

const userRecordLock = (user_id, transaciton) => {
    return new Promise(async (resolve, reject) => {
        try {
            await query(
                "SELECT * FROM `KOSEN_PAY_LOG` WHERE `user_id` = ? FOR UPDATE;",
                [user_id],
                transaciton
            ).catch((e) => {
                throw e;
            });

            resolve(true);
        }catch(e) {
            reject(e);
        }
    });
}

export default userRecordLock;