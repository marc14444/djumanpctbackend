import io from "socket.io-client";

// Connexion au serveur Socket.IO
const socket = io("http://localhost:4000");

// Rejoindre une salle pour recevoir les messages
const joinRoom = (userId) => {
  socket.emit("joinRoom", { role: "artisan", userId });
};

// Écouter les messages entrants
socket.on("receiveMessage", ({ senderId, message }) => {
  console.log(`Message reçu de ${senderId}: ${message}`);
});

// Envoyer un message
const sendMessage = (receiverId, message) => {
  socket.emit("sendMessage", { senderId: 1, receiverId, message, role: "artisan" });
};

// Écouter les messages reçus
socket.on("receiveMessage", ({ senderId, message }) => {
  console.log(`Message reçu de ${senderId}: ${message}`);
});

// Déconnexion du serveur Socket.IO
socket.on("disconnect", () => {
  console.log("Déconnexion du serveur Socket.IO");
});

// Exporter les fonctions pour rejoindre une salle et envoyer un message
export { joinRoom, sendMessage };