console.log("SERVER FILE:", __filename);

console.log("START TIME:", new Date());
require("dotenv").config();

const path =
require("path");

const {
    initializeClients
} = require(
    "./whatsappClient"
);

const sessionRoutes =
require("./routes/sessions");

console.log(

    "LOADING:",

    require.resolve(

        "./routes/agentActions"

    )

);
const agentActions =
require(
    "./routes/agentActions"
);

const qrRoutes =
require("./routes/qr");

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

/*
Middleware
*/

app.use(cors());

app.use(express.json());

app.use(
    "/agent",
    agentActions
);

app.use(
    "/qr",
    qrRoutes
);

app.use(

    express.static(

        path.join(
            __dirname,
            "public"
        )

    )

);

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

const leadRoutes =
require("./routes/leads");

app.use(
    "/leads",
    leadRoutes
);


const agentRoutes =
require("./routes/agents");

app.use(
    "/agents",
    agentRoutes
);

app.use(
    "/sessions",
    sessionRoutes
);


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

app.get(

    "/admin",

    (req,res)=>{

        res.sendFile(

            path.join(

                __dirname,

                "public",

                "admin.html"

            )

        );

    }

);


/*
Start server
*/

app.listen(

    PORT,

    async()=>{

        console.log(
            `Server running on port ${PORT}`
        );

        await initializeClients();

    }

);


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