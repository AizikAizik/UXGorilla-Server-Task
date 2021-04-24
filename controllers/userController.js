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
    async (request, response) =>{
        const {
            username,
            password,
            fname,
            lname
        } = request.body;

        if(
            validateName(fname) && 
            validateName(lname) &&
            validatePassword(password) &&
            validateUsername(username)
        ){
            let hash = await hashPassword(password);
            const newData = Users.push({
                id: uuidv4(),
                username,
                password: hash,
                fname,
                lname
            });

            let data = JSON.stringify(Users, null, 4);

            fs.writeFileSync('./database/users.json',data, {encoding: 'utf-8'});

            response.status(200);

            response.json({
                result : true,
                message: "SignUp success. Please proceed to Signin"
            })
        }else{
            response.status(400);
            throw new Error("Invalid username or password or fname or lname");
        }
    }
)

export {
    signUp
}