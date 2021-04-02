const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { findUser, addUser } = require("./user.service");

const registerUser = (request, response) => {
    const userData = request.body;

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(userData.password, salt);

    userData.hashedPassword = hashedPassword;

    // Check If User Already Registered
    findUser(userData, (status, data) => {
        if (status === "error") {
            return response.status(500).json({
                status: "error",
                message: "Some Unexpected Error Happened",
            });
        } else if (status === "success") {
            return response.status(200).json({
                status: "exists",
                message: "User Already Registered",
            });
        } else if (status === "notexists") {
            // Register User
            addUser(userData, (newUserStatus, newUserData) => {
                if (newUserStatus === "error") {
                    return response.status(500).json({
                        status: "error",
                        message: "Some Unexpected Error Happened",
                    });
                } else if (newUserStatus === "success") {
                    delete userData.password;
                    userData.userId = newUserData.insertId;

                    const jsonToken = sign({ data: userData }, process.env.JSON_WEBTOKEN_SECRET, {
                        expiresIn: process.env.JSON_WEBTOKEN_EXPIRY_LIMIT,
                    });

                    return response.status(200).json({
                        status: "success",
                        message: "User Registered Successfully",
                        token: jsonToken,
                    });
                }
            });
        }
    });
};

const authenticateUser = (request, response) => {
    const userData = request.body;

    // Check If User Already Registered
    findUser(userData, (status, data) => {
        if (status === "error") {
            return response.status(500).json({
                status: "error",
                message: "Some Unexpected Error Happened",
            });
        } else if (status === "notexists") {
            return response.status(200).json({
                status: "notexists",
                message: "User Not Exists",
            });
        } else if (status === "success") {
            if (compareSync(userData.password, data.password)) {
                delete data.password;

                const jsonToken = sign({ data: data }, process.env.JSON_WEBTOKEN_SECRET, {
                    expiresIn: process.env.JSON_WEBTOKEN_EXPIRY_LIMIT,
                });

                return response.status(200).json({
                    status: "success",
                    message: "User Authenticated Successfully",
                    token: jsonToken,
                });
            }

            return response.status(200).json({
                status: "invalid",
                message: "Incorrect Password",
            });
        }
    });
};

const getDetails = (request, response) => {
    const userData = request.tokenData.data;

    findUser(userData, (status, data) => {
        if (status === "error") {
            return response.status(500).json({
                status: "error",
                message: "Some Unexpected Error Happened",
            });
        } else if (status === "notexists") {
            return response.status(500).json({
                status: "notexists",
                message: "User Not Found",
                data: null,
            });
        } else if (status === "success") {
            delete data.password;

            return response.status(200).json({
                status: "success",
                message: "User Details Found",
                data: data,
            });
        }
    });
};

module.exports = {
    registerUser,
    authenticateUser,
    getDetails,
};
