import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { Users } from '../database/db.js';

dotenv.config();

const protect = asyncHandler(
    (request, response, next) => {
        let token;

        if (
            request.headers.authorization &&
            request.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = request.headers.authorization.split(" ")[1];

                let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

                request.user = Users.find(user => {
                    if (user.username === decodedToken.username) {
                        return {
                            id: user.id,
                            username: user.username,
                            fname: user.fname,
                            lname: user.lname
                        }
                    }
                })

                //console.log(request.user);

                next();
            } catch (error) {
                console.log(error);
                response.status(401);
                response.json({
                    result: false,
                    error: "JWT Verification Failed"
                })
            }
        }

        // if no token is not found
        if (!token) {
            response.status(401);
            response.json({
                result: false,
                error: "Please provide a JWT token"
            })
        }
    }
)

export { protect }