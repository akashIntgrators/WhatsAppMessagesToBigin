const db =
require("./database");



function getAgents(){

    return new Promise(

        (resolve,reject)=>{

            db.all(

                `
                SELECT *
                FROM agents
                WHERE isActive = 1
                ORDER BY agentName
                `,

                [],

                (err,rows)=>{

                    if(err){

                        return reject(err);

                    }

                    resolve(rows);

                }

            );

        }

    );

}

function addAgent(

    agentId,
    agentName,
    email

){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                INSERT INTO agents(

                    agentId,
                    agentName,
                    email

                )
                VALUES(

                    ?,
                    ?,
                    ?

                )
                `,

                [

                    agentId,
                    agentName,
                    email

                ],

                function(err){

                    if(err){

                        return reject(err);

                    }

                    resolve({

                        id:this.lastID

                    });

                }

            );

        }

    );

}

function getAllAgents(){

    return new Promise(

        (resolve,reject)=>{

            db.all(

                `
SELECT

    agentId,

    agentName,

    email,

    isActive,

    sessionStatus,

    lastConnected,

    createdAt
                FROM agents
                ORDER BY agentName
                `,

                [],

                (err,rows)=>{

                    if(err){
                        return reject(err);
                    }

                    resolve(rows);

                }

            );

        }

    );

}

function disableAgent(agentId){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                UPDATE agents
                SET isActive = 0
                WHERE agentId = ?
                `,

                [agentId],

                function(err){

                    if(err){
                        return reject(err);
                    }

                    resolve();

                }

            );

        }

    );

}

function updateAgentStatus(
    agentId,
    status
){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                UPDATE agents
                SET

                    sessionStatus = ?,

                    lastConnected =

                    CASE

                        WHEN ? = 'Connected'

                        THEN CURRENT_TIMESTAMP

                        ELSE lastConnected

                    END

                WHERE agentId = ?
                `,

                [

                    status,
                    status,
                    agentId

                ],

                function(err){

                    if(err){

                        return reject(err);

                    }

                    resolve();

                }

            );

        }

    );

}

function enableAgent(
    agentId
){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                UPDATE agents
                SET isActive = 1
                WHERE agentId = ?
                `,

                [agentId],

                function(err){

                    if(err){

                        return reject(err);

                    }

                    resolve();

                }

            );

        }

    );

}

function deleteAgent(agentId){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                DELETE
                FROM agents
                WHERE agentId = ?
                `,

                [agentId],

                function(err){

                    if(err){
                        return reject(err);
                    }

                    resolve();

                }

            );

        }

    );

}

module.exports = {

    getAgents,
    disableAgent,
    addAgent,
    getAllAgents,
updateAgentStatus,
deleteAgent,
enableAgent
};