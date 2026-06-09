const {

    stopAgentSession

} = require(
    "./clientManager"
);

const agentId =
process.argv[2];

(async()=>{

    await stopAgentSession(
        agentId
    );

})();