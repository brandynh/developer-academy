const fs = require("fs");

function loadSubmissions(callback) {
    fs.readFile("submissions.json", "utf8", (err, data) => {


        if (err) {
            callback(err, null);
            return
        } else {
            const submissions = JSON.parse(data);
            callback(null, submissions)
        }
    });
}

function saveSubmissions(submissions, callback) {

    const jsonData = JSON.stringify(submissions);

    fs.writeFile("submissions.json", jsonData, (err) => {

        if (err) {
            callback(err);
            return;
        } else {
            callback(null);
        }

    });

}

function addSubmission(newSubmission, callback) {
    loadSubmissions((err, submissions) => {

        if (err) {
            callback(err);
            return;
        }
        submissions.push(newSubmission);

        saveSubmissions(submissions, callback);
    });

}

module.exports = { loadSubmissions, saveSubmissions, addSubmission };