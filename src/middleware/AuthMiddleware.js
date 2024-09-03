// renaming the file from A to a

import jsonwebtoken from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next();
    } catch {
        res.status(400).json({ error: "Invalid token" });
    }
};

export default AuthMiddleware;
