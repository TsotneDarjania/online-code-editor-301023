import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

export class MySocket {
  socket = null;

  isTextAreaFocused = false;

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
      // console.log("Another user moved cursor");
      this.renderer.updateCursor(data.x, data.y);
    });

    this.socket.on("click-text-area", () => {
      const textAreaElement = document.getElementById("editorInput");

      this.isTextAreaFocused = true;

      setInterval(() => {
        if (this.isTextAreaFocused) textAreaElement.focus();
      }, 100);
    });

    this.socket.on("update-editor-text", (text) => {
      const textAreaElement = document.getElementById("editorInput");

      text === "Backspace"
        ? (textAreaElement.value = textAreaElement.value.slice(0, -1))
        : (textAreaElement.value += text);
    });
  }

  sendEvent(eventName, data) {
    // console.log("Sending event", eventName, data);
    this.socket.emit(eventName, data);
  }
}
