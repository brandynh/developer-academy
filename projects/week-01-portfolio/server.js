const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome to my server!");
    } else if (req.url === "/contact" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("This is the contact endpoint");
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not found!");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});         