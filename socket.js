import { Server } from "socket.io";

let io; // Pour stocker l'instance Socket.IO

export const initializeSocket = (server) => {
  // Initialisation de Socket.IO
  io = new Server(server, {
    cors: {
      origin: "*", // Autoriser les requêtes CORS (modifiez selon vos besoins)
      methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS","PUT", "CONNECT", "HEAD"],
    },
  });

  console.log("Socket.IO initialisé");

  // Gestion des connexions
  io.on("connection", (socket) => {
    console.log(`Nouvelle connexion établie : ${socket.id}`);

    // Événement pour rejoindre une salle (ex : client ou artisan)
    socket.on("joinRoom", ({ role, userId }) => {
      const room = `${role}-${userId}`;
      socket.join(room);
      console.log(`${socket.id} a rejoint la salle : ${room}`);
    });

    // Exemple : Événement de chat entre artisans et clients
    socket.on("sendMessage", ({ senderId, receiverId, message, role }) => {
      const receiverRoom = `${role}-${receiverId}`;
      io.to(receiverRoom).emit("receiveMessage", { senderId, message });
      console.log(`Message envoyé de ${senderId} à ${receiverRoom}`);
    });

    // Exemple : Notification pour les admins
    socket.on("adminNotification", ({ message }) => {
      io.to("admin-room").emit("receiveNotification", { message });
    });

    // Déconnexion
    socket.on("disconnect", () => {
      console.log(`Déconnexion : ${socket.id}`);
    });
  });

  return io;
};

// Exportation de l'instance Socket.IO
export const getIO = () => {
  if (!io) throw new Error("Socket.IO n'est pas encore initialisé !");
  return io;
};
