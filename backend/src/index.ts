import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./db/db.ts";
import errorHandling from "./middleware/errorHandling.js";
import userRoutes from "./routes/user.route.ts";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());


//routes 

app.use("api/", userRoutes)


// error handling;

app.use(errorHandling)

// testing postgress

app.get("/db", async (req, res)=>{
    try {
        // const client = await pool.connect();
        const result = await pool.query("SELECT current_database()");
        res.send(result.rows[0].current_database);
        // client.release();
    } catch (error) {
        console.error("Error occurred while querying database:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


const port = process.env.PORT|| 3000;

app.get("/", (req, res)=>{
    res.send("hello world");
})

app.listen(port, ()=>{
    console.log(`server is runing on ${port}`);
    
})