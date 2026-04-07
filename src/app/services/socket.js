import { io } from "socket.io-client";

let socket = null;

// Connect to WebSocket server via Gateway
export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io("http://localhost:3000", {
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("WebSocket connected successfully");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  return socket;
};

// Join a family room
export const joinFamilyRoom = (familyId) => {
  if (socket && familyId) {
    socket.emit("join-family", familyId);
  }
};

// Leave a family room
export const leaveFamilyRoom = (familyId) => {
  if (socket && familyId) {
    socket.emit("leave-family", familyId);
  }
};

// Disconnect the socket completely
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Expose socket for attaching event listeners
export const getSocket = () => socket;
