import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateToken(username, firstname) {
    return jwt.sign({ username, firstname }, process.env.JWT_SECRET_KEY, { expiresIn: "14d" });
}

export { generateToken }