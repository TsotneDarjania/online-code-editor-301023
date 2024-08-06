import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("view engine", "ejs");
app.set("views", "views");

export { app, io, httpServer };

export const config = {
  port: process.env.PORT || 3000,
};
