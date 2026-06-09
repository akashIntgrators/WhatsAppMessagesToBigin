const {
    enableAgent
} = require(
    "./agentService"
);

const agentId =
process.argv[2];

if(!agentId){

    console.log(
        "Usage: node enableAgent.js agentId"
    );

    process.exit();

}

(async()=>{

    await enableAgent(
        agentId
    );

    console.log(
        `${agentId} enabled`
    );

})();