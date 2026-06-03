const fs   = require("fs");
const path = require("path");
const db   = require("./database");

const {
    getLeadOwner
} = require("./leadOwnership");

function formatDate(dateString){

    const date = new Date(dateString);

    return date.toLocaleString(
        "en-IN",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

}

async function saveWhatsAppMessage(
    phone,
    data
){

    try{

        const folder = path.join(
            __dirname,
            "conversations"
        );

        if(
            !fs.existsSync(folder)
        ){

            fs.mkdirSync(folder);

        }

        const filePath = path.join(
            folder,
            `${phone}.txt`
        );

        let createdDate =
        formatDate(
            data.timestamp
        );

        let messageCount = 0;

        let transcript = "";

        /*
        Existing file
        */

        if(
            fs.existsSync(
                filePath
            )
        ){

            const existingContent =
            fs.readFileSync(
                filePath,
                "utf8"
            );

            const createdMatch =

            existingContent.match(
                /Created\s+:\s+(.*)/
            );

            if(
                createdMatch
            ){

                createdDate =
                createdMatch[1].trim();

            }

            const countMatch =

            existingContent.match(
                /Messages\s+:\s+(\d+)/
            );

            if(
                countMatch
            ){

                messageCount =
                parseInt(
                    countMatch[1]
                );

            }

            const dividerIndex =

            existingContent.indexOf(
                "====================================================",
                100
            );

            if(
                dividerIndex > -1
            ){

                transcript =
                existingContent.substring(
                    dividerIndex +
                    "====================================================".length
                );

            }

        }

        messageCount++;

        let sender;

        if(
            data.direction ===
            "Outgoing"
        ){

            sender =
            `${data.agentName} → ${data.leadName}`;

        }
        else{

            sender =
            `${data.leadName} → ${data.agentName}`;

        }

        const messageBlock =

`\n[${formatDate(data.timestamp)}]

${sender}

${data.text}

`;

        transcript +=
        messageBlock;

        /*
        Get lead owner
        */

        const owner =
        await getLeadOwner(
            phone
        );

        const ownerName =

        owner?.ownerAgentName ||

        "Unassigned";

        /*
        Get all participating agents
        */

        const agents =
        await new Promise(

            (resolve,reject)=>{

                db.all(

                    `
                    SELECT DISTINCT
                    agentName
                    FROM messages
                    WHERE phone = ?
                    `,

                    [phone],

                    (err,rows)=>{

                        if(err){

                            reject(err);
                            return;

                        }

                        resolve(

                            rows
                            .map(
                                row =>
                                row.agentName
                            )
                            .filter(Boolean)

                        );

                    }

                );

            }

        );

        const header =

`====================================================
WhatsApp Conversation

Contact  : ${data.leadName}
Phone    : ${phone}

Owner    : ${ownerName}

Agents   : ${agents.join(", ")}

Messages : ${messageCount}

Created  : ${createdDate}
Updated  : ${formatDate(data.timestamp)}

====================================================`;

        fs.writeFileSync(

            filePath,

            header +
            transcript,

            "utf8"

        );

        console.log(
            "Conversation updated"
        );

    }

    catch(err){

        console.log(
            err
        );

    }

}

module.exports = {

    saveWhatsAppMessage

};