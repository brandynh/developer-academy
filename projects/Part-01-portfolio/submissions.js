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

// loadSubmissions((err, submissions) => {
//     if (err) {
//         console.log("Error:", err);
//         return;
//     }
//     console.log(submissions);
// });

module.exports = loadSubmissions;