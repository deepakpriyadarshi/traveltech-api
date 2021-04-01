const { genSaltSync, hashSync } = require("bcrypt");
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
        }

        if (status === "notexists") {
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
                        expiresIn: "10h",
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

module.exports = {
    registerUser,
};
