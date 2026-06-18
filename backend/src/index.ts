import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import orgRoutes from "./routes/org.route.js";
import projectRoutes from "./routes/projectt.route.js";
import projectMemberRoutes from "./routes/projectMember.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import { initDatabase } from "./data/initDatabase.js";
import errorHandling from "./middleware/errorHandling.js";

dotenv.config();

const app = express();


const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());




//routes 

app.use("/api/", userRoutes)
app.use("/api/", orgRoutes)
app.use("/api/", projectRoutes)
app.use("/api/", projectMemberRoutes)
app.use("/api/", dashboardRoutes)


// error handling;

app.use(errorHandling)



// testing postgress

app.get("/", (req, res) => {
    console.log("Home route hit");
    res.send("API Working");
});

app.get("/db", async (req, res) => {
    try {
        const client = await pool.connect();

        console.log("Client acquired");

        const result = await client.query(
            "SELECT current_database()"
        );

        

        client.release();

        console.log("Client released");

        res.send(result.rows[0].current_database);

    } catch (err) {
        console.error(err);
        res.status(500).send("DB Error");
    }
});





async function start() {
    console.log("1. Starting app");

    await initDatabase();

    console.log("2. Database initialized");

    const server = app.listen(port, () => {
        console.log(`3. Server is running on ${port}`);
    });

    server.on("error", (err) => {
    console.error("Listen error:", err);
});

    console.log("4. app.listen called");

    server.on("close", () => {
        console.log("❌ Server closed");
    });

    
}

start()