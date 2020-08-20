import express from "express";
import cors from "cors";
import "dotenv/config";

import { normalizePort } from "./appHelperFunctions";
import mongooseConnection from "./db";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
mongooseConnection(process.env.MONGO_URI);

// Route Middlewares
app.use("/api", require("./server/routes/auth"));
app.use("/api/posts", require("./server/routes/posts"));

// Server port and start
const port = normalizePort(process.env.PORT || "5000");
app.listen(port, () => console.log(`Server running on PORT ${port}`));
