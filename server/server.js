import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIO } from "socket.io";
import disasterRoutes from "./routes/disaster.js";
import geoCodeRoute from "./routes/geocode.js";
import { mockAuthMiddleware } from "./middleware/auth.js";

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: { origin: "*" },
});

// Make io accessible in routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.json());
app.use(mockAuthMiddleware);
app.use(cors());

app.use("/disasters", disasterRoutes);
app.use("/geocode", geoCodeRoute);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server started on  port : ${PORT}\n`);
});
