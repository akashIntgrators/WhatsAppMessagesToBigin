const {
    getAllAgents
} = require(
    "./agentService"
);

(async()=>{

    const agents =
    await getAllAgents();

    console.table(
        agents
    );

})();