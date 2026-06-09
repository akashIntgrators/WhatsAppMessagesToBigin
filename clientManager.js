const {
    clients,
    createClient
} = require(
    "./whatsappClient"
);

const {
    getAllAgents
} = require(
    "./agentService"
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

async function stopAgentSession(
    agentId
){

    const client =
    clients[agentId];

    if(!client){

        return false;

    }

await client.destroy();

await updateAgentStatus(

    agentId,

    "Disconnected"

);

await updateSessionStatus(

    agentId,

    "Disconnected"

);

delete clients[
    agentId
];

return true;

        console.log(
    "STOPPING:",
    agentId
);

    

console.log(
    "STOPPED:",
    agentId
);


}

async function startAgentSession(
    agentId
){

    if(
        clients[agentId]
    ){

        console.log(
            `${agentId} already running`
        );

        return true;

    }

    const agents =
    await getAllAgents();

    const agent =
    agents.find(

        a =>
        a.agentId ===
        agentId

    );

    if(!agent){

        console.log(
            `${agentId} not found`
        );

        return false;

    }

    console.log(
        `Starting ${agentId}`
    );

    createClient({

        id:
        agent.agentId,

        name:
        agent.agentName,

        email:
        agent.email

    });

    return true;

}

module.exports = {

    stopAgentSession,

    startAgentSession

};