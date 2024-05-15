import jwt from "jsonwebtoken";
const jwtFn = (object) => {
    return jwt.sign(object, process.env.SECRET_KEY, { expiresIn: "1d" });
};

export default jwtFn;
