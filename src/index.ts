
import { Express } from "express";
import dotenv from "dotenv"
import cors from "cors"
import { errorHandler } from './utilis/errorHandler';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/Oauth.routes';
import express, { Application } from "express";
// import { PORT } from "./config/config";
import twoFactorRoutes from "./routes/twoFactor.routes";

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
app.use("/api/v1/auth", oauthRoutes),
app.use("/api/v1/login",authRoutes)
app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
});



// const app: Application = express();

app.use(express.json());
app.use("/api", twoFactorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


