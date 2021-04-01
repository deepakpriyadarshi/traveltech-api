const { verify } = require("jsonwebtoken");

const verifyUserToken = (request, response, next) => {
    const authorizationHeader = request.get("authorization");

    if (authorizationHeader) {
        const token = authorizationHeader.slice(7);

        verify(token, process.env.JSON_WEBTOKEN_SECRET, (error, tokenData) => {
            if (error) {
                response.status(500).json({
                    status: "invalid",
                    message: "Invalid Token",
                });
            } else {
                request.tokenData = tokenData;

                next();
            }
        });
    } else {
        response.status(500).json({
            status: "missing",
            message: "Authorization Header / Data Is Missing",
        });
    }
};

module.exports = {
    verifyUserToken,
};
