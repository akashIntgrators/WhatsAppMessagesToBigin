const express = require("express");
const router = express.Router();

const db = require("../database");

router.get(
    "/search",
    (req,res)=>{

        const q =
        req.query.q || "";

        db.all(

            `
            SELECT

                phone,
                leadName,

                COUNT(*) as messages,

                MAX(timestamp)
                as lastUpdated

            FROM messages

            WHERE

                phone LIKE ?

                OR

                leadName LIKE ?

            GROUP BY phone

            ORDER BY lastUpdated DESC
            `,

            [

                `%${q}%`,
                `%${q}%`

            ],

            (err,rows)=>{

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json(rows);

            }

        );

    }

);

module.exports =
router;