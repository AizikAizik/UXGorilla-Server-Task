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
import { generateToken } from '../utils/tokenization.js'

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

        // check if body is empty
        if(
            !request.body.username &&
            !request.body.password &&
            !request.body.fname    &&
            !request.body.lname
        ){
            response.status(400);
            response.json({
                result: false,
                error: "fields can't be empty"
            });
            return;
        }


        // check if one or more fields exist
        if(
            !request.body.username ||
            !request.body.password ||
            !request.body.fname    ||
            !request.body.lname
        ){
            response.status(400);
            response.json({
                result: false,
                error: "fields can't be empty"
            });
            return;
        }

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
                error: "fname or lname check failed"
            })
        }

        else if (!validateName(lname)) {
            response.status(400);
            response.json({
                result: false,
                error: "fname or lname check failed"
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

// POST /signin
// must have JSON body of username and password
// public route

const signIn = asyncHandler(
    async (request, response) =>{
        const {
            username,
            password
        } = request.body;

        if(!request.body.username || !request.body.password){
            response.status(400);
            response.json({
                result: false,
                error: "Please provide username and password"
            });
            return;
        }

        // first check if the username already exists
        const isUserExist = Users.find( user => user.username === username )

        if(
            isUserExist && await validateHashPassword(password, isUserExist.password)
        ){
            const token = generateToken(username, isUserExist.fname);

            response.status(200);
            response.json({
                result: true,
                jwt: token,
                message: 'Signin success'
            })
        }else{
            response.status(400);
            response.json({
                result: false,
                error: 'Invalid username/password'
            })
        }
    }
)

export {
    signUp,
    signIn
}