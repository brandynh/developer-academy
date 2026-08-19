const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);

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
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Name is required!");
                return;
            };

            if (!formData.email.includes("@")) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid email!");
                return;

            };

            if (!formData.message) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Message is required!");
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

                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Form received!");
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



    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not found!");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});         