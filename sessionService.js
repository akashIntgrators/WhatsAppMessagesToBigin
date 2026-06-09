const db =
require("./database");

function createSession(
    agentId
){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                INSERT OR IGNORE
                INTO agent_sessions(

                    agentId,
                    sessionId

                )
                VALUES(

                    ?,
                    ?

                )
                `,

                [

                    agentId,
                    `session_${agentId}`

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

function getSessions(){

    return new Promise(

        (resolve,reject)=>{

            db.all(

                `
                SELECT *
                FROM agent_sessions
                ORDER BY agentId
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

function updateSessionStatus(
    agentId,
    status
){

    return new Promise(

        (resolve,reject)=>{

            db.run(

                `
                UPDATE agent_sessions
                SET

                    status = ?,

                    updatedAt =
                    CURRENT_TIMESTAMP

                WHERE agentId = ?
                `,

                [
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

function getAllSessions(){

    return new Promise(

        (resolve,reject)=>{

            db.all(

                `
                SELECT
                    agentId,
                    sessionId,
                    status,
                    createdAt,
                    updatedAt
                FROM agent_sessions
                ORDER BY agentId
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

module.exports = {
getAllSessions,
    createSession,
updateSessionStatus,
    getSessions

};