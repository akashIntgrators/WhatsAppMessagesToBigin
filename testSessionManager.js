const {

    startAgentSession,

    getRunningSessions

} = require(
    "./sessionManager"
);

(async()=>{

    await startAgentSession(
        "john"
    );

    console.log(

        getRunningSessions()

    );

})();