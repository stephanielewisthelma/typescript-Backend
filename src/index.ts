import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import userRouter from './routes/user.route';
import { errorHandler } from './utilis/errorHandler';
import courseRouter from './routes/courses.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const portEnv =process.env.PORT
if(!portEnv){
    console.error("Error:PORT is not defined in .env file");
    process.exit(1);
}

const PORT:number = parseInt(portEnv, 10)
const app =express();
const corsOption ={
    origin:
    "*",
    Credential:true,
    allowedHeaders:"*",
    methods:"GET, PUT, HEAD, PATCH, POST, DELETE"

};

app.use(cors(corsOption));

app.use(express.json());

// app.use("/api/v1/users", userRouter)

// app.use("/api/v1/courses", courseRouter)

app.use("/api/v1/login", authRoutes)

app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
});