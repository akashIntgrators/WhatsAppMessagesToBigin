const express = require("express");
const router = express.Router();

const db = require("../database");

const {
    assignLead
} = require("../leadOwnership");

const {
    saveWhatsAppMessage
} = require("../biginService");

const {
    syncConversation
} = require("../biginSync");

router.post("/", async (req, res) => {

const {
    agentId,
    agentName,
    messageId,
    phone,
    leadName,
    direction,
    text,
    timestamp
} = req.body;

    db.run(
        `
INSERT OR IGNORE INTO messages(
    agentId,
    agentName,
    messageId,
    phone,
    leadName,
    direction,
    message,
    timestamp
)
VALUES(?,?,?,?,?,?,?,?)
        `,
[
    agentId,
    agentName,
    messageId,
    phone,
    leadName,
    direction,
    text,
    timestamp
],

        async function(err){

            if(err){

                console.log(err);

                return res
                    .status(500)
                    .json(err);

            }

            console.log("SQLITE OK");
            await assignLead(
    phone,
    agentId,
    agentName
);

            try {

await saveWhatsAppMessage(
    phone,
    {
        agentId,
        agentName,
        messageId,
        phone,
        leadName,
        direction,
        text,
        timestamp
    }
);

                console.log(
                    "Conversation updated"
                );

                console.log(
                    "BEFORE BIGIN SYNC"
                );

                await syncConversation(
                    phone
                );

                console.log(
                    "AFTER BIGIN SYNC"
                );

                return res.json({
                    status: "saved"
                });

            }
            catch(error){

                console.log(
                    "SYNC ERROR"
                );

                console.log(
                    error.response?.data ||
                    error.message ||
                    error
                );

                return res.status(500).json({
                    error:
                    error.message
                });

            }

        }

    );

});

module.exports = router;