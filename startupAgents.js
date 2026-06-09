const {
    getAgents
} = require(
    "./agentService"
);

async function loadAgents(){

    const dbAgents =
    await getAgents();

    return dbAgents.map(

        agent => ({

            id:
            agent.agentId,

            name:
            agent.agentName,

            email:
            agent.email

        })

    );

}

module.exports = {
    loadAgents
};