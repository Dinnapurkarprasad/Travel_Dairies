import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    // Extract token from the "Bearer <token>" format
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    // Verify token with the secret
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    });
}
