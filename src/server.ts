import express from "express";
import { config } from "./config/index";
import { app, io, httpServer } from "./config/index";

import pageRouter from "./routes/pageRouters";

let users = 0;

app.use(express.static("static"));

app.use(pageRouter);

io.on("connection", (socket: any) => {
  users++;

  io.emit("update-users", users);

  socket.broadcast.emit("join-another-user");

  socket.on("click-editor", () => {
    console.log("click-editor");
    socket.broadcast.emit("editor-input");
  });

  socket.on("move-cursor", (mousePositions: any) => {
    socket.broadcast.emit("move-cursor", mousePositions);
  });

  socket.on("click-text-area", () => {
    socket.broadcast.emit("click-text-area");
  });

  socket.on("update-text-area", (text: string) => {
    socket.broadcast.emit("update-editor-text", text);
  });

  socket.on("disconnect", () => {
    users--;
    io.emit("update-users", users);
  });
});

export function startServer() {
  httpServer.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}
