const fetch = require('node-fetch');

exports.handler = async function(event, context, callback) {

    // fetch some data from a REST API
    const rawHttpResponse = await fetch("https://putsreq.com/5BG4sgQxkftAzQNkrozi");
    const responseBody = await rawHttpResponse.json();

    // return the data we just received
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    });
};

