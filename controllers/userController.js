import { Users } from '../database/db.js';
import {
    validateHashPassword,
    hashPassword
} from '../utils/hashing.js';
import {
    validateName,
    validatePassword,
    validateUsername
} from '../utils/inputValidation.js';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// POST /signup
// must have body of username,fname,lname,password
// public route
const signUp = asyncHandler(
    async (request, response) => {
        const {
            username,
            password,
            fname,
            lname
        } = request.body;

        // first check if the username already exists
        const isUserExist = Users.find( user => user.username === username )

        if(isUserExist){
            response.status(400);
            response.json({
                result: false,
                error: "username already exists"
            })
            return;
        }

        if (!validateUsername(username)) {
            response.status(400);
            response.json({
                result: false,
                error: "username check failed"
            })
        }

        else if (!validateName(fname)) {
            response.status(400);
            response.json({
                result: false,
                error: "fname check failed"
            })
        }

        else if (!validateName(lname)) {
            response.status(400);
            response.json({
                result: false,
                error: "lname check failed"
            })
        }

        else if (!validatePassword(password)) {
            response.status(400);
            response.json({
                result: false,
                error: "password check failed"
            })
        }
        else {
            let hash = await hashPassword(password);
            const newData = Users.push({
                id: uuidv4(),
                username,
                password: hash,
                fname,
                lname
            });

            let data = JSON.stringify(Users, null, 4);

            fs.writeFileSync('./database/users.json', data, { encoding: 'utf-8' });

            response.status(200);

            response.json({
                result: true,
                message: "SignUp success. Please proceed to Signin"
            })
        }

    }
)

export {
    signUp
}