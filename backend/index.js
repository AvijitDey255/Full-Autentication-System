import express from "express"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors"
import "dotenv/config"
import dbConnect from "./dbConnect/dbConnect.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 3800;

const corsOption ={
    origin: [""],
    credentials: true,
    methods:["GET","POST","PUT"]
}
// middleware
app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))


app.get("/",(req,res)=>{
    res.send("hello world!");
})
app.use('/api/users',userRouter)
dbConnect()
app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})