function logger(req, res, next) {
    console.log("Method:", req.method, "Endpoint:", req.url);
    next();
}

module.exports = logger;