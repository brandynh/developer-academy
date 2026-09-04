const http = require("http");
const fs = require("fs");
const { error } = require("console");

function sendJSON(res, statusCode, data) {

    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));

};

function logger(req, res, next) {

    console.log("Method:", req.method, "Endpoint:", req.url);
    next();

}

const server = http.createServer((req, res) => {



    const parts = req.url.split("/");

    logger(req, res, () => {

        if (req.url === "/" && req.method === "GET") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Welcome to my server!");
        } else if (req.url === "/contact" && req.method === "GET") {

            fs.readFile("contact.html", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Unable to load contact page.");
                    return;
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });



        } else if (req.url === "/contact" && req.method === "POST") {

            let body = "";


            req.on("data", (chunk) => {
                body += chunk;
            });




            req.on("end", () => {

                const params = new URLSearchParams(body);
                console.log("RAW BODY:", JSON.stringify(body));

                console.log("Name: " + params.get("name"));
                console.log("Email: " + params.get("email"));
                console.log("Subject: " + params.get("subject"));
                console.log("Message: " + params.get("message"));


                const formData = {

                    name: params.get("name"),
                    email: params.get("email"),
                    subject: params.get("subject"),
                    message: params.get("message")
                };


                if (!formData.name) {
                    const response = {
                        error: "Name is required"
                    };
                    sendJSON(res, 400, response);
                    return;
                };

                if (!formData.email.includes("@")) {
                    const response = {
                        error: "Invalid email"
                    };
                    sendJSON(res, 400, response);
                    return;

                };

                if (!formData.message) {
                    const response = {
                        error: "Message is required"
                    };
                    sendJSON(res, 400, response);
                    return;
                }

                console.log(formData);

                fs.readFile("submissions.json", "utf8", (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const submissions = JSON.parse(data);
                    submissions.push(formData);
                    const jsonData = JSON.stringify(submissions);


                    fs.writeFile("submissions.json", jsonData, (err) => {

                        if (err) {
                            console.error(err);
                            return;
                        }

                        console.log("Submission Saved!");

                        const response = {
                            message: "Submission created successfully!",
                            submission: formData
                        };

                        sendJSON(res, 201, response);
                    });


                });



            });
        } else if (req.url === "/submissions" && req.method === "GET") {

            fs.readFile("submissions.json", (err, data) => {
                if (err) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Unable to retrieve data.");
                    return;
                }

                const submissions = JSON.parse(data);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(submissions));
            });



        } else if (req.method === "GET" &&
            parts[1] === "submissions" &&
            parts[2] !== undefined
        ) {

            fs.readFile("submissions.json", "utf8", (err, data) => {

                if (err) {
                    console.error(err);
                    return;
                }
                const submissions = JSON.parse(data);

                const index = Number(parts[2]);
                const submission = submissions[index];

                if (submission === undefined) {

                    sendJSON(res, 404, {
                        error: "Resource not found"
                    });
                    return;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(submission));
            });
        } else if (
            req.method === "PUT" &&
            parts[1] === "submissions" &&
            parts[2] !== undefined
        ) {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", () => {



                fs.readFile("submissions.json", "utf8", (err, data) => { // Read old submissions
                    if (err) {
                        sendJSON(res, 500, {
                            error: "Unable to retrieve submissions"   // If error send JSON error response 
                        });
                        return;
                    }


                    const formData = JSON.parse(body); //Convert formData into JSON
                    const submissions = JSON.parse(data); // Fill submissions with data
                    const index = Number(parts[2]); // Get the requested index number
                    const submission = submissions[index];  // Get the specific indexed data

                    if (submission === undefined) {  // Send error if specific submission doesn't exist
                        sendJSON(res, 404, {
                            error: "Submission not found"
                        });
                        return;
                    }

                    submissions[index] = formData;

                    const jsonData = JSON.stringify(submissions);

                    fs.writeFile("submissions.json", jsonData, (err) => {

                        if (err) {
                            sendJSON(res, 500, {
                                error: "Unable to write file"
                            });
                            return;
                        }

                        sendJSON(res, 200, {
                            message: "Submission updated successfully",
                            submission: formData
                        });

                    });

                });

            });


        } else if (
            req.method === "PATCH" &&
            parts[1] === "submissions" &&
            parts[2] !== undefined
        ) {

            let body = "";

            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", () => {

                let updates;

                try {
                    updates = JSON.parse(body);
                } catch (err) {
                    sendJSON(res, 400, {
                        error: "Invalid JSON"
                    });
                    return;
                }

                if (Array.isArray(updates)) {
                    sendJSON(res, 400, {
                        error: "Updates must be an object"
                    });
                    return;
                }

                if (Object.keys(updates).length === 0) {

                    sendJSON(res, 400, {
                        error: "No fields provided to update"
                    });
                    return;
                }

                if ("name" in updates && !updates.name) {
                    sendJSON(res, 400, {
                        error: "Name cannot be empty"
                    });
                    return;
                }

                if ("email" in updates && !updates.email.includes("@")) {
                    sendJSON(res, 400, {
                        error: "Invalid email"
                    });
                    return;
                }

                if ("message" in updates && !updates.message) {
                    sendJSON(res, 400, {
                        error: "Message cannot be empty"
                    });
                    return;
                }

                fs.readFile("submissions.json", "utf8", (err, data) => {
                    if (err) {
                        sendJSON(res, 500, {
                            error: "Unable to retrieve submission"
                        });
                        return;
                    }

                    const submissions = JSON.parse(data);
                    const index = Number(parts[2]);
                    const submission = submissions[index];

                    if (submission === undefined) {
                        sendJSON(res, 404, {
                            error: "Submission not found"
                        });
                        return;
                    }
                    Object.assign(submission, updates);




                    const jsonData = JSON.stringify(submissions);

                    fs.writeFile("submissions.json", jsonData, (err) => {
                        if (err) {
                            sendJSON(res, 500, {
                                error: "Unable to write file"
                            });
                            return;
                        }

                        sendJSON(res, 200, {
                            message: "Submission updated successfully",
                            submission: submission
                        });

                    });
                })

            });


        } else if (
            req.method === "DELETE" &&
            parts[1] === "submissions" &&
            parts[2] !== undefined
        ) {

            fs.readFile("submissions.json", "utf8", (err, data) => {
                if (err) {
                    sendJSON(res, 500, {
                        error: "Unable to retrieve submissions"
                    });
                    return;
                }
                const submissions = JSON.parse(data);
                const index = Number(parts[2]);
                const submission = submissions[index];

                if (submission === undefined) {
                    sendJSON(res, 404, {
                        error: "Submission not found"
                    });
                    return;
                } else {

                    submissions.splice(index, 1);
                }

                const jsonData = JSON.stringify(submissions);

                fs.writeFile("submissions.json", jsonData, (err) => {
                    if (err) {
                        sendJSON(res, 500, {
                            error: "Unable to write file"
                        });
                        return;
                    }
                });

                res.writeHead(204);
                res.end();

            });

        } else {
            sendJSON(res, 404, {
                error: "Resource not found"
            });
        }
    });

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});         