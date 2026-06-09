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

    /*
    --------------------------------
    Agents
    --------------------------------
    */

    db.run(

        `
        CREATE TABLE IF NOT EXISTS agents(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            agentId TEXT UNIQUE,

            agentName TEXT NOT NULL,

            email TEXT,

            isActive INTEGER DEFAULT 1,

            sessionStatus TEXT DEFAULT 'Disconnected',

            lastConnected TEXT,

            createdAt TEXT DEFAULT CURRENT_TIMESTAMP

        )
        `

    );

/*
--------------------------------
Agent Sessions
--------------------------------
*/

db.run(

    `
    CREATE TABLE IF NOT EXISTS agent_sessions(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        agentId TEXT UNIQUE,

        sessionId TEXT UNIQUE,

        status TEXT DEFAULT 'Disconnected',

        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,

        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP

    )
    `

);
    

    /*
    --------------------------------
    Schema Upgrades
    --------------------------------
    */

    db.run(

        `
        ALTER TABLE agents
        ADD COLUMN sessionStatus TEXT DEFAULT 'Disconnected'
        `,

        [],

        ()=>{}

    );

    db.run(

        `
        ALTER TABLE agents
        ADD COLUMN lastConnected TEXT
        `,

        [],

        ()=>{}

    );

});

module.exports =
db;