import { MySocket } from "./socket.js";
import { calculatePersentage } from "./helper.js";

const DOM = {
  users: document.getElementById("users"),
  cursor: document.getElementById("cursor"),
};

class Renderer {
  constructor() {
    this.addMouseMoveEventListener();
  }

  updateUsers(userCount) {
    DOM.users.innerText = `Online Users: ${userCount}`;
  }

  createAnotherUserCursor() {
    DOM.cursor.style.display = "block";
  }

  updateCursor(x, y) {
    DOM.cursor.style.left = `${x}%`;
    DOM.cursor.style.top = `${y}%`;
  }

  addMouseMoveEventListener() {
    window.addEventListener("mousemove", (data) => {
      const mousePositionX = data.clientX;
      const mousePositionY = data.clientY;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      socket.sendEvent("move-cursor", {
        x: calculatePersentage(mousePositionX, screenWidth),
        y: calculatePersentage(mousePositionY, screenHeight),
      });
    });
  }
}

// Init
const renderer = new Renderer();
const socket = new MySocket(renderer);
