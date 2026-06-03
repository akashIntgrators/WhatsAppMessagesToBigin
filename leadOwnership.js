const db = require("./database");

/*
Assign lead if no owner exists
*/

function assignLead(
    phone,
    agentId,
    agentName
){

    return new Promise((resolve,reject)=>{

        db.get(

            `
            SELECT *
            FROM lead_assignments
            WHERE phone = ?
            `,

            [phone],

            (err,row)=>{

                if(err){

                    reject(err);
                    return;

                }

                /*
                Already assigned
                */

                if(row){

                    resolve(row);
                    return;

                }

                /*
                First assignment
                */

                db.run(

                    `
                    INSERT INTO lead_assignments(

                        phone,
                        ownerAgentId,
                        ownerAgentName,
                        assignedAt

                    )
                    VALUES(?,?,?,?)
                    `,

                    [

                        phone,
                        agentId,
                        agentName,

                        new Date()
                        .toISOString()

                    ],

                    function(insertErr){

                        if(insertErr){

                            reject(
                                insertErr
                            );

                            return;

                        }

                        console.log(
                            `Lead assigned: ${phone} -> ${agentName}`
                        );

                        resolve({

                            phone,
                            ownerAgentId:
                            agentId,

                            ownerAgentName:
                            agentName

                        });

                    }

                );

            }

        );

    });

}

/*
Get owner
*/

function getLeadOwner(
    phone
){

    return new Promise((resolve,reject)=>{

        db.get(

            `
            SELECT *
            FROM lead_assignments
            WHERE phone = ?
            `,

            [phone],

            (err,row)=>{

                if(err){

                    reject(err);
                    return;
                }

                resolve(row);

            }

        );

    });

}

module.exports = {

    assignLead,
    getLeadOwner

};