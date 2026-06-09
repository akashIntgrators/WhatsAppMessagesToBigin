const {

    getAgents

} = require(
    "./agentService"
);

(async()=>{

    const agents =

    await getAgents();

    console.log(
        agents
    );

})();