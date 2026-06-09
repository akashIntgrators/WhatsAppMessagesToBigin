const express =
require("express");

const router =
express.Router();

const {
    createClient,
    stopClient
} = require(
    "../whatsappClient"
);

const {

    getAllAgents,

    addAgent,

    disableAgent,

    enableAgent

} = require(
    "../agentService"
);

/*
--------------------------------
GET ALL AGENTS
--------------------------------
*/

router.get(

    "/",

    async(req,res)=>{

        try{

            const agents =
            await getAllAgents();

            res.json(
                agents
            );

        }
        catch(err){

            res.status(500)
            .json({

                error:
                err.message

            });

        }

    }

);

/*
--------------------------------
ADD AGENT
--------------------------------
*/

router.post(

    "/",

    async(req,res)=>{

        try{

            const {

                agentId,

                agentName,

                email

            } = req.body;

            if(
                !agentId ||
                !agentName
            ){

                return res
                .status(400)
                .json({

                    error:
                    "agentId and agentName required"

                });

            }

            const result =
            await addAgent(

                agentId,
                agentName,
                email || null

            );

            createClient({
                id: agentId,
                name: agentName,
                email: email || null
});

            res.json({

                success:true,

                id:
                result.id

            });

        }
        catch(err){

            res.status(500)
            .json({

                error:
                err.message

            });

        }

    }

);

/*
--------------------------------
DISABLE AGENT
--------------------------------
*/

router.patch(

    "/:agentId/disable",

    async(req,res)=>{

        try{

            await stopClient(
            req.params.agentId
            );


            await disableAgent(

                req.params.agentId

            );

            res.json({

                success:true

            });

        }
        catch(err){

            res.status(500)
            .json({

                error:
                err.message

            });

        }

    }

);

/*
--------------------------------
ENABLE AGENT
--------------------------------
*/

router.patch(

    "/:agentId/enable",

    async(req,res)=>{

        try{

            await enableAgent(

                req.params.agentId

            );

            const agents =
            await getAllAgents();
            const agent =
            agents.find(
                a =>
                a.agentId ===
                req.params.agentId
            );

            if(agent){
                createClient({
                    id:
                    agent.agentId,
                    name:
                    agent.agentName,
                    email:
                    agent.email
                });
            }

            res.json({

                success:true

            });

        }
        catch(err){

            res.status(500)
            .json({

                error:
                err.message

            });

        }

    }

);

module.exports =
router;