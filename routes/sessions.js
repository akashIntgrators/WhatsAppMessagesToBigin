const express =
require("express");

const router =
express.Router();

const {
    getAllSessions
} = require(
    "../sessionService"
);

router.get(

    "/",

    async(req,res)=>{

        try{

            const sessions =
            await getAllSessions();

            res.json(
                sessions
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

module.exports =
router;