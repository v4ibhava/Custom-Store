const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(400).json({ msg: "Invalid Authentication." });
        }

        // Extract the token
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1] // Extract token after "Bearer"
            : authHeader; // Use the full header if "Bearer" is missing

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ msg: "Invalid Authentication." });
            }
            // Debugging
            // console.log("Decoded Token:", user); 
            req.user = { ...user, id: user.id };
            next();
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = auth;

