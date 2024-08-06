import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

export class MySocket {
  socket = null;

  constructor(renderer) {
    this.renderer = renderer;
    this.init();
  }

  init() {
    this.socket = io("http://localhost:3000");

    this.addSocketEventListeners();
  }

  addSocketEventListeners() {
    this.socket.on("update-users", (userCount) => {
      this.renderer.updateUsers(userCount);
      if (userCount > 1) {
        this.renderer.createAnotherUserCursor();
      }
    });

    this.socket.on("join-another-user", () => {
      this.renderer.createAnotherUserCursor();
    });

    this.socket.on("move-cursor", (data) => {
      console.log("Another user moved cursor");
      this.renderer.updateCursor(data.x, data.y);
    });
  }

  sendEvent(eventName, data) {
    console.log("Sending event", eventName, data);
    this.socket.emit(eventName, data);
  }
}
