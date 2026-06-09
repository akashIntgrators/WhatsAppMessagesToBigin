const qrCodes = {};

function saveQR(
    agentId,
    qr
){

    qrCodes[agentId] = qr;

}

function getQR(
    agentId
){

    return qrCodes[
        agentId
    ];

}

function removeQR(
    agentId
){

    delete qrCodes[
        agentId
    ];

}

module.exports = {

    saveQR,

    getQR,

    removeQR

};