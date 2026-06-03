const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { getAccessToken } =
require("./tokenService");

/*
--------------------------------
Find Contact
--------------------------------
*/

async function findContactByPhone(
    phone
){

    const token =
    await getAccessToken();

    const response =
    await axios.get(

        "https://www.zohoapis.com/bigin/v2/Contacts/search",

        {
            headers:{
                Authorization:
                `Zoho-oauthtoken ${token}`
            },

            params:{
                phone
            }
        }

    );

    if(
        !response.data.data ||
        response.data.data.length === 0
    ){
        return null;
    }

    return response.data.data[0];

}

/*
--------------------------------
Get Notes
--------------------------------
*/

async function getNotes(
    contactId
){

    const token =
    await getAccessToken();

    const response =
    await axios.get(

        `https://www.zohoapis.com/bigin/v1/Contacts/${contactId}/Notes`,

        {
            headers:{
                Authorization:
                `Zoho-oauthtoken ${token}`
            }
        }

    );

    return response.data.data || [];

}

/*
--------------------------------
Find WhatsApp Note
--------------------------------
*/

function findWhatsAppNote(
    notes
){

    return notes.find(

        note =>

        note.Note_Title ===
        "WhatsApp Conversation"

    );

}

/*
--------------------------------
Create Note
--------------------------------
*/

async function createWhatsAppNote(
    contactId,
    content
){

    const token =
    await getAccessToken();

    const response =
    await axios.post(

        "https://www.zohoapis.com/bigin/v2/Notes",

        {

            data:[
                {

                    Note_Title:
                    "WhatsApp Conversation",

                    Note_Content:
                    content,

                    Parent_Id:
                    contactId,

                    se_module:
                    "Contacts"

                }
            ]

        },

        {
            headers:{
                Authorization:
                `Zoho-oauthtoken ${token}`
            }
        }

    );

    return response.data;

}

/*
--------------------------------
Update Note
--------------------------------
*/

async function updateWhatsAppNote(
    noteId,
    content
){

    const token =
    await getAccessToken();

    const response =
    await axios.put(

        `https://www.zohoapis.com/bigin/v2/Notes/${noteId}`,

        {

            data:[
                {

                    id:
                    noteId,

                    Note_Content:
                    content

                }
            ]

        },

        {
            headers:{
                Authorization:
                `Zoho-oauthtoken ${token}`
            }
        }

    );

    return response.data;

}

/*
--------------------------------
Sync Transcript
--------------------------------
*/

async function syncConversation(
    phone
){

    try{

        console.log(
            "Syncing:",
            phone
        );

        const contact =
        await findContactByPhone(
            phone
        );

        if(
            !contact
        ){

            console.log(
                "Contact not found"
            );

            return;
        }

        const contactId =
        contact.id;

        const filePath =
        path.join(

            __dirname,

            "conversations",

            `${phone}.txt`

        );

        if(
            !fs.existsSync(
                filePath
            )
        ){

            console.log(
                "Transcript not found"
            );

            return;
        }

        const transcript =
        fs.readFileSync(
            filePath,
            "utf8"
        );

        const notes =
        await getNotes(
            contactId
        );

        const existing =
        findWhatsAppNote(
            notes
        );

        if(
            existing
        ){

            console.log(
                "Updating note"
            );

            await updateWhatsAppNote(

                existing.id,

                transcript

            );

        }
        else{

            console.log(
                "Creating note"
            );

            await createWhatsAppNote(

                contactId,

                transcript

            );

        }

        console.log(
            "Sync complete"
        );

    }

    catch(err){

        console.log(
            "BIGIN SYNC ERROR"
        );

        console.log(

            err.response?.data ||

            err.message

        );

    }

}

module.exports = {

    syncConversation

};