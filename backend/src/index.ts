import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors);


//routes 

// error handling;



const port = process.env.PORT|| 3000;

app.get("/", (req, res)=>{
    res.send("hello world");
})

app.listen(port, ()=>{
    console.log(`server is runing on ${port}`);
    
})