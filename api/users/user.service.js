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

const addUser = (userData, callbackFunction) => {
    pool.query(
        `
        INSERT INTO users(firstName, lastName, email, dob, password)
        VALUES(?, ?, ?, ?, ?)
        `,
        [userData.firstName, userData.lastName, userData.email, userData.dob, userData.password],
        (error, results, fields) => {
            if (error) {
                callbackFunction("error", error);
            }

            callbackFunction("success", null);
        }
    );
};

module.exports = {
    findUser,
};
