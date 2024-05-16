import jwt from "jsonwebtoken";
import fails from "../utils/fails.js";

const auth = async (req, res, next) => {
    const tokenBearer = req.headers.Authorization || req.headers.authorization;
    if (tokenBearer) {
        try {
            const token = tokenBearer.split(" ")[1];
            const tokenInfo = jwt.verify(token, process.env.SECRET_KEY);
            req.tokenInfo = tokenInfo;
            next();
        } catch (error) {
            res.status(401).json(fails(error.message));
        }
    } else {
        res.status(401).json(fails("Token is required"));
    }
};

export default auth;
