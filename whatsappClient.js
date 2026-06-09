const qrcode = require("qrcode-terminal");

const fs = require("fs");
const path = require("path");

const {
    Client,
    LocalAuth
} = require("whatsapp-web.js");


const {

    saveQR,

    removeQR

} = require(
    "./qrStore"
);

const axios = require("axios");

const {
    loadAgents
} = require(
    "./startupAgents"
);

const {

    updateAgentStatus

} = require(

    "./agentService"

);

const {
    updateSessionStatus
} = require(
    "./sessionService"
);

const clients = {};

async function saveMedia(
    phone,
    media
){

    try{

        const folder = path.join(
            __dirname,
            "media",
            phone
        );

        fs.mkdirSync(
            folder,
            {
                recursive:true
            }
        );

        let extension = "bin";

        if(
            media?.mimetype
        ){

            extension =
            media.mimetype
            .split("/")
            .pop();

        }

        const filename =
        `${Date.now()}.${extension}`;

        const filepath =
        path.join(
            folder,
            filename
        );

        fs.writeFileSync(
            filepath,
            media.data,
            "base64"
        );

        return filename;

    }
    catch(err){

        console.log(
            "MEDIA SAVE ERROR"
        );

        console.log(err);

        return null;

    }

}


function cleanupLocks(agentId){

    const sessionPath = path.join(
        __dirname,
        ".wwebjs_auth",
        `session-${agentId}`
    );

    if(!fs.existsSync(sessionPath)){
        return;
    }

    fs.readdirSync(sessionPath)
      .filter(file =>
          file.startsWith("Singleton")
      )
      .forEach(file => {

          try{

              fs.unlinkSync(
                  path.join(
                      sessionPath,
                      file
                  )
              );

              console.log(
                  `Removed ${file} for ${agentId}`
              );

          }
          catch(err){

              console.log(
                  err.message
              );

          }

      });

}

function createClient(agent){
cleanupLocks(agent.id);


console.log(

    "CREATE CLIENT CALLED:",

    agent.id

);
    const client = new Client({

        authStrategy:
        new LocalAuth({

            clientId:
            agent.id

        })

    });

    const processedMessages =
    new Set();

    async function processMessage(
        message
    ){

        try{

            if(!message){
                return;
            }

            /*
            Ignore status updates
            */

            if(
                message.from ===
                "status@broadcast"
            ){
                return;
            }

            /*
            Determine message content
            */
            let messageText =
message.body;

            

            const uniqueId =

            `${agent.id}_` +

            (

                message.id?.id ||

                `${message.from}-${message.timestamp}`

            );

            if(
                processedMessages.has(
                    uniqueId
                )
            ){
                return;
            }

            processedMessages.add(
                uniqueId
            );

            const chat =
            await message.getChat();

            /*
            Ignore groups
            */

            if(
                chat.isGroup
            ){
                return;
            }

            const contact =
            await chat.getContact();

            let phone;

            if(
                !message.fromMe
            ){

                phone =
                contact.id?.user;

            }
            else{

                phone =
                contact.id?.user ||
                chat.id?.user;

            }

            if(
                !phone
            ){

                console.log(
                    `[${agent.name}] No phone found`
                );

                return;
            }

            if(
    message.hasMedia
){

    try{

        const media =
        await message.downloadMedia();

        const savedFile =
        await saveMedia(
            phone,
            media
        );

        if(
            media?.mimetype
        ){

            if(
                media.mimetype.startsWith(
                    "image/"
                )
            ){

                messageText =
                `📷 Image Attachment\nSaved: ${savedFile}`;

            }
            else if(
                media.mimetype.startsWith(
                    "video/"
                )
            ){

                messageText =
                `🎥 Video Attachment\nSaved: ${savedFile}`;

            }
            else if(
                media.mimetype.startsWith(
                    "audio/"
                )
            ){

                messageText =
                `🎵 Audio Attachment\nSaved: ${savedFile}`;

            }
            else if(
                media.mimetype ===
                "application/pdf"
            ){

                messageText =
                `📄 PDF Attachment\nSaved: ${savedFile}`;

            }
            else{

                messageText =
                `📎 Attachment\nSaved: ${savedFile}`;

            }

        }

    }
    catch(err){

        console.log(
            `[${agent.name}] Media save failed`
        );

        console.log(
            err.message
        );

        messageText =
        "📎 Media Attachment";

    }

}
else if(
    !messageText ||
    !messageText.trim()
){

    messageText =
    "[Empty Message]";

}

            const direction =

            message.fromMe

            ?

            "Outgoing"

            :

            "Incoming";

            const data = {

                agentId:
                agent.id,

                agentName:
                agent.name,

                messageId:
                uniqueId,

                phone:
                phone,

                leadName:

                contact.pushname ||

                contact.name ||

                phone,

                direction:
                direction,

                text:
                messageText,

                timestamp:

                new Date(
                    message.timestamp * 1000
                ).toISOString()

            };

            console.log(
                "\n================================"
            );

            console.log(
                `[${agent.name}]`
            );

            console.log(
                data
            );

            console.log(
                "================================\n"
            );

            await axios.post(

                "http://127.0.0.1:3000/messages",

                data

            );

        }

        catch(err){

            console.log(
                `[${agent.name}] ERROR`
            );

            console.log(
                err.message
            );

        }

    }

client.on(

    "qr",

    (qr)=>{

        saveQR(
            agent.id,
            qr
        );

        console.log(
            `\n${agent.name.toUpperCase()} QR:\n`
        );

        qrcode.generate(

            qr,

            {
                small:true
            }

        );

    }

);

client.on(

    "ready",

    async()=>{



        await updateAgentStatus(

            agent.id,

            "Connected"

        );
        await updateSessionStatus(
    agent.id,
    "Connected"
);
        removeQR(agent.id);

        console.log(
            `${agent.name} ready`
        );

    }

);

client.on(

    "disconnected",

    async()=>{

        await updateAgentStatus(

            agent.id,

            "Disconnected"

        );
        await updateSessionStatus(
    agent.id,
    "Disconnected"
);

        console.log(
            `${agent.name} disconnected`
        );

    }

);

    /*
    Incoming messages
    */

    client.on(

        "message",

        async(message)=>{

            await processMessage(
                message
            );

        }

    );

    /*
    Outgoing messages
    */

    client.on(

        "message_create",

        async(message)=>{

            await processMessage(
                message
            );

        }

    );

client.initialize();

clients[agent.id] =client;

return client;

}

async function initializeClients(){

    const agents =
    await loadAgents();

    console.log(
        `Loading ${agents.length} agents`
    );

    for(
        const agent of agents
    ){

        console.log(
            `Starting agent: ${agent.name}`
        );

        createClient(
            agent
        );

    }

}

setTimeout(()=>{

    console.log(
        "CLIENTS:",
        Object.keys(clients)
    );

},10000);

async function stopClient(
    agentId
){

    try{

        const client =
        clients[agentId];

        if(!client){

            console.log(
                `Client not found: ${agentId}`
            );

            return false;

        }

        await client.destroy();

        delete clients[agentId];

        console.log(
            `Client stopped: ${agentId}`
        );

        return true;

    }
    catch(err){

        console.log(
            err
        );

        return false;

    }

}

function deleteAgent(
    agentId
){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                DELETE
                FROM agents
                WHERE agentId = ?
                `,

                [agentId],

                function(err){

                    if(err){

                        return reject(err);

                    }

                    resolve();

                }

            );

        }

    );

}

module.exports = {

    clients,
    stopClient,
    createClient,
    deleteAgent,
    initializeClients

};