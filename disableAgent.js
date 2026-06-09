const {
    disableAgent
} = require(
    "./agentService"
);

const agentId =
process.argv[2];

(async()=>{

    await disableAgent(
        agentId
    );

    console.log(
        `${agentId} disabled`
    );

})();