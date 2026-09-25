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

        const ids = submissions.map(submission => submission.id);
        const highestId = ids.length > 0 ? Math.max(...ids) : 0;
        const newId = highestId + 1;
        newSubmission.id = newId;

        submissions.push(newSubmission);

        saveSubmissions(submissions, callback);
    });

}

function findSubmissionById(id, callback) {
    loadSubmissions((err, submissions) => {

        if (err) {
            callback(err);
            return;
        }

        const submission = submissions.find(
            submission => submission.id === id
        );

        if (!submission) {
            callback(null, null);
            return;
        }

        callback(null, submission);

    });


}

module.exports = { loadSubmissions, saveSubmissions, addSubmission, findSubmissionById };