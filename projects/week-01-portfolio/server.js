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
            console.log(body);

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Form received!");
        });

    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not found!");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});         