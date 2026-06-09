const {
    getSessions
} = require(
    "./sessionService"
);

(async()=>{

    const sessions =
    await getSessions();

    console.table(
        sessions
    );

})();