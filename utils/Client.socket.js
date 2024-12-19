import io from "socket.io-client";

// Connexion au serveur Socket.IO
const socket = io("http://localhost:4000");

// Envoyer un message
const sendMessage = (senderId, receiverId, message) => {
  socket.emit("sendMessage", { senderId, receiverId, message, role: "artisan" });
};

// Écouter les messages reçus
socket.on("receiveMessage", ({ senderId, message }) => {
  console.log(`Message reçu de ${senderId}: ${message}`);
});

// Déconnexion du serveur Socket.IO
socket.on("disconnect", () => {
  console.log("Déconnexion du serveur Socket.IO");
});

export default sendMessage;