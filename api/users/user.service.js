const e = require("express");
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

            if (results.length === 1) {
                callbackFunction("success", results[0]);
            } else {
                callbackFunction("notexists", null);
            }
        }
    );
};

const addUser = (userData, callbackFunction) => {
    pool.query(
        `
        INSERT INTO users(firstName, lastName, email, dob, password)
        VALUES(?, ?, ?, ?, ?)
        `,
        [userData.firstName, userData.lastName, userData.email, userData.dob, userData.hashedPassword],
        (error, results, fields) => {
            if (error) {
                callbackFunction("error", error);
            } else {
                callbackFunction("success", results);
            }
        }
    );
};

module.exports = {
    findUser,
    addUser,
};
