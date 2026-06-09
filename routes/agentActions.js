const fs =
require("fs");

const path =
require("path");

const {
    deleteAgent
} = require(
    "../agentService"
);

const express =
require("express");

const router =
express.Router();

const {
    enableAgent,
    disableAgent
} = require(
    "../agentService"
);

const {
    createClient,
    stopClient
} = require(
    "../whatsappClient"
);

const {
    getAllAgents
} = require(
    "../agentService"
);

const {

    stopAgentSession,

    startAgentSession

} = require(
    "../clientManager"
);

router.post(
    "/:agentId/start",

    async(req,res)=>{

        try{

            const result =

            await startAgentSession(

                req.params.agentId

            );

            res.json({

                success:result

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

router.post(

    "/:agentId/stop",

    async(req,res)=>{

        try{

            const result =

            await stopAgentSession(

                req.params.agentId

            );

            res.json({

                success:result

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

router.post(

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

router.post(

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

router.delete(

    "/:agentId",

    async(req,res)=>{

        try{

            const agentId =

                req.params.agentId;

            await stopClient(
                agentId
            );

            await deleteAgent(
                agentId
            );

            const sessionPath =

                path.join(

                    process.cwd(),

                    ".wwebjs_auth",

                    `session-${agentId}`

                );

            if(
                fs.existsSync(
                    sessionPath
                )
            ){

                fs.rmSync(

                    sessionPath,

                    {
                        recursive:true,
                        force:true
                    }

                );

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

module.exports = router;