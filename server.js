console.log("SERVER FILE:", __filename);

console.log("START TIME:", new Date());
require("dotenv").config();

const leadRoutes =
require("./routes/leads");

app.use(
    "/leads",
    leadRoutes
);

require(

"./whatsappClient"

);

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

/*
Middleware
*/

app.use(cors());

app.use(express.json());
app.use((req, res, next) => {

    console.log(

        "REQUEST:",

        req.method,

        req.url

    );

    next();

});


/*
Routes
*/


const messageRoutes =
require("./routes/messages");

const authRoutes =
require("./routes/auth");

console.log("REGISTERING MESSAGE ROUTES");

app.use(
    "/messages",
    messageRoutes
);

app.use(
    "/auth/bigin",
    authRoutes
);


/*
Health check
*/

app.get("/",(req,res)=>{

    res.send(
        "Server OK"
    );

});


/*
Start server
*/

app.listen(
PORT,
()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});


/*
Catch unexpected errors
*/

process.on(
    "uncaughtException",
    (err)=>{

        console.log(
            "Unexpected error:"
        );

        console.log(
            err
        );

    }
);

process.on(
    "unhandledRejection",
    (err)=>{

        console.log(
            "Unhandled promise:"
        );

        console.log(
            err
        );

    }
);