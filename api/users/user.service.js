const pool = require("../../config/database");

const findUser = (userData, callbackFunction) => {
    pool.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [userData.email],
        (error, results, fields) => {
            if (error) {
                callbackFunction("error", error);
            }

            callbackFunction("success", results[0]);
        }
    );
};

module.exports = {
    findUser,
};
