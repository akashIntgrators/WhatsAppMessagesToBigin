const qrcode = require("qrcode-terminal");

const fs = require("fs");
const path = require("path");

const {
    Client,
    LocalAuth
} = require("whatsapp-web.js");

const axios = require("axios");

const agents =
require("./config/agents");

const clients = [];

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

function createClient(agent){

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

        ()=>{

            console.log(
                `${agent.name} ready`
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

    clients.push(
        client
    );

}

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

module.exports =
clients;