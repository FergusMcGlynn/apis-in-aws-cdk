const fetch = require('node-fetch');

const coursesApiEndpoint = "https://putsreq.com/5BG4sgQxkftAzQNkrozi";

const fetchCourses = async (callback) => {
    const response = await fetch(coursesApiEndpoint);
    const json = await response.json();

    callback(null, {
        statusCode: 200,
        body: json
    })
};

exports.handler = async function(event, context, callback) {
    await fetchCourses(callback);
};

