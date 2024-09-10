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

window.addEventListener("DOMContentLoaded", () => {
  const textAreaElement = document.getElementById("editorInput");

  // Add an event listener for the focus event
  textAreaElement.addEventListener("focus", function () {
    socket.sendEvent("click-text-area");
  });

  textAreaElement.addEventListener("keydown", (event) => {
    setTimeout(() => {
      const lastSymbol =
        textAreaElement.value[textAreaElement.value.length - 1];

      if (event.key === "Backspace") {
        socket.sendEvent("update-text-area", "Backspace");
        return;
      }

      if (
        event.key === "Enter" ||
        event.key === "Tab" ||
        event.key === "Shift"
      ) {
        return;
      }

      socket.sendEvent("update-text-area", lastSymbol);
    }, 20);
  });

  document.getElementById("runButton").addEventListener("click", () => {
    const output = document.getElementById("output");
    const jsCode = document.getElementById("editorInput").value;

    try {
      // Create a new function with the code
      const customScript = new Function("output", jsCode);

      // Execute the function and pass the output element to it
      customScript(output);
    } catch (error) {
      console.log("Custom Script Error: ", error.message);
      // If there's an error, display it in the output
      output.textContent = "Error: " + error.message;
    }
  });
});

// Init
const renderer = new Renderer();
const socket = new MySocket(renderer);
