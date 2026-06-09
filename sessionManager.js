const {
    createClient,
    clients
} = require(
    "./whatsappClient"
);

const {
    getAllAgents
} = require(
    "./agentService"
);

const activeSessions =
new Map();

async function startAgentSession(
    agentId
){

    const agents =
    await getAllAgents();

    const agent =
    agents.find(

        a =>
        a.agentId ===
        agentId

    );

    if(!agent){

        throw new Error(
            `Agent not found: ${agentId}`
        );

    }

    if(
        activeSessions.has(
            agentId
        )
    ){

        console.log(
            `${agentId} already running`
        );

        return;

    }

    createClient({

        id:
        agent.agentId,

        name:
        agent.agentName,

        email:
        agent.email

    });

    activeSessions.set(

        agentId,

        true

    );

    console.log(

        `${agent.agentName} session started`

    );

}

function markSessionRunning(
    agentId
){

    activeSessions.set(
        agentId,
        true
    );

}

function markSessionStopped(
    agentId
){

    activeSessions.delete(
        agentId
    );

}

function isSessionRunning(
    agentId
){

    return activeSessions.has(
        agentId
    );

}

function getRunningSessions(){

    return Array.from(

        activeSessions.keys()

    );

}

function registerExistingSession(
    agentId
){

    activeSessions.set(
        agentId,
        true
    );

}

module.exports = {

    startAgentSession,
registerExistingSession,
    markSessionRunning,

    markSessionStopped,

    isSessionRunning,

    getRunningSessions

};