const {

    addAgent

} = require(
    "./agentService"
);

        const {
    createSession
} = require(
    "./sessionService"
);

const agentId =
process.argv[2];

const agentName =
process.argv[3];

const email =
process.argv[4] || null;

if(

    !agentId ||

    !agentName

){

    console.log(

        `
Usage:

node addAgent.js \
agentId \
"Agent Name" \
email@company.com

        `

    );

    process.exit();

}

(async()=>{

    try{

        await addAgent(

            agentId,

            agentName,

            email

        );

await createSession(
    agentId
);

        console.log(

            "Agent Added Successfully"

        );

        console.log({

            agentId,

            agentName,

            email

        });

    }
    catch(err){

        console.log(

            "ERROR"

        );

        console.log(
            err.message
        );

    }

})();