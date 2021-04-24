import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// import custom error middlewares
import { notFound, serverError } from './middlewares/errorMiddleware.js';

// import custom db from file system 
import { Users } from './database/db.js';

// import controllers
import { signUp } from './controllers/userController.js'

const app = express();

dotenv.config();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
app.get('/', (request, response) =>{
    response.send('<h4>Server is awaiting your command</h4>')
})

app.post('/signup', signUp)

// run error middlewares at the bottom of the file
app.use(notFound);
app.use(serverError);

console.log(Users);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`server running on PORT: ${PORT}`));