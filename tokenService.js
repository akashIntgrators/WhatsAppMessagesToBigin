const axios = require("axios");
require("dotenv").config();

let accessToken = null;
let tokenPromise = null;

async function getAccessToken() {

    if (accessToken) {
        return accessToken;
    }

    if (tokenPromise) {
        return tokenPromise;
    }

    console.log("Generating token...");

    tokenPromise = axios.post(

        "https://accounts.zoho.com/oauth/v2/token",

        null,

        {
            params: {
                refresh_token:
                    process.env.BIGIN_REFRESH_TOKEN,

                client_id:
                    process.env.BIGIN_CLIENT_ID,

                client_secret:
                    process.env.BIGIN_CLIENT_SECRET,

                grant_type:
                    "refresh_token"
            }
        }

    )

    .then(response => {

        accessToken =
            response.data.access_token;

        console.log("Token ready");

        return accessToken;

    })

    .catch(err => {

        console.log("TOKEN ERROR");

        console.log(
            JSON.stringify(
                err.response?.data ||
                err.message,
                null,
                2
            )
        );

        accessToken = null;

        throw err;

    })

    .finally(() => {

        tokenPromise = null;

    });

    return tokenPromise;
}

function clearToken() {

    accessToken = null;

}

module.exports = {

    getAccessToken,
    clearToken

};