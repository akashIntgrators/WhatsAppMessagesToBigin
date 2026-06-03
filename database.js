const sqlite3 =
require("sqlite3")
.verbose();

const path =
require("path");

const dbPath =
path.join(
    __dirname,
    "data",
    "crm.db"
);

const db =
new sqlite3.Database(

    dbPath,

    (err)=>{

        if(err){

            console.log(
                "DB Error:",
                err
            );

        }
        else{

            console.log(
                "SQLite connected"
            );

        }

    }

);

db.serialize(()=>{

    /*
    --------------------------------
    Messages
    --------------------------------
    */

    db.run(

        `
        CREATE TABLE IF NOT EXISTS messages(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            agentId TEXT,

            agentName TEXT,

            messageId TEXT UNIQUE,

            phone TEXT,

            leadName TEXT,

            direction TEXT,

            message TEXT,

            timestamp TEXT

        )
        `

    );

    /*
    --------------------------------
    Lead Ownership
    --------------------------------
    */

    db.run(

        `
        CREATE TABLE IF NOT EXISTS lead_assignments(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            phone TEXT UNIQUE,

            ownerAgentId TEXT,

            ownerAgentName TEXT,

            assignedAt TEXT

        )
        `

    );

});

module.exports =
db;