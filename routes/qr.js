const express =
require("express");

const QRCode =
require("qrcode");

const router =
express.Router();

const {
    getQR
} = require(
    "../qrStore"
);

router.get(

    "/:agentId",

    async(req,res)=>{

        try{

            const qr =

            getQR(

                req.params.agentId

            );

            if(!qr){

                return res.json({

                    connected:true

                });

            }

            const image =

            await QRCode.toDataURL(
                qr
            );

            res.json({

                connected:false,

                image

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