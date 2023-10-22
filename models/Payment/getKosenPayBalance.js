import { query } from "../DB/DB";


const getBalance = (
    user_id,
    transaciton
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await query(
                "SELECT SUM(`amount`) AS `balance` FROM `KOSEN_PAY_LOG` WHERE `user_id` = ?;",
                [user_id],
                transaciton
            ).catch(e => {
                throw e;
            });

            if (result.length === 0) {
                resolve(0);
            }

            resolve(result[0].balance || 0);
        }catch(e) {
            reject(e);
        }
    });
}

export default getBalance;