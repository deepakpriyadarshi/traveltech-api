require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRouter = require("./api/users/user.router");

app.use("/api/user", userRouter);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server Listening On ${process.env.APP_PORT}`);
});

app.get("/api", (request, response) => {
    response.status(200).json({
        status: "success",
        message: "Travel Tech Startup API Is Working",
        env: process.env.APP_PORT,
    });
});
