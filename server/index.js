import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routers ===================
import memoriesRouter from "./routers/memories/api.js";
import usersRouter from "./routers/users/api.js";

// utils =====================
import fails from "./utils/fails.js";

// logic
dotenv.config();
await mongoose.connect(process.env.MEMORIES);
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users/", usersRouter);
app.use("/api/memories/", memoriesRouter);
app.use("/api/uploads/", express.static("./uploads"));

app.use("*", async (req, res) => {
    res.status(404).json(fails());
});

app.listen(Number(process.env.PORT));
