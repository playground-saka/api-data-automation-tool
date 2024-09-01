import jsonwebtoken from "jsonwebtoken";

export const generateToken = (userId) => {
    return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};


