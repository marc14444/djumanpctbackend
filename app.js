import express from "express";
// import Gemini from "gemini-ai";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Pour le serveur HTTP
import { Server } from "socket.io"; // Pour Socket.IO
import connectDB from "./config/db.js";
import adminRoutes from "./Routes/adminRoutes.js";
import clientsRoutes from "./Routes/clientsRoutes.js";
import artisanRoutes from "./Routes/artisanRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";
import metiersRoutes from "./Routes/metiersRoutes.js";
import localitesRoutes from "./Routes/localitesRoutes.js";
import likesRoutes from "./Routes/likesRoutes.js";
import commentaireRoutes from "./Routes/commentaireRoutes.js";
import rendezvousRoutes from "./Routes/rendezvousRoutes.js";
import notesRoutes from "./Routes/notesRoutes.js";
import temoignageRoutes from "./Routes/temoignageRoutes.js";
import ConversationRoutes from "./Routes/conversationRoutes.js";
import MessageRoutes from "./Routes/messagesRoutes.js";
import bodyParser from 'body-parser';


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Création du serveur HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Autoriser toutes les origines (ajustez selon vos besoins)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Gestion des événements Socket.IO
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  // Exemple : Écouter un événement personnalisé
  socket.on("joinRoom", ({ role, userId }) => {
    const room = `${role}-${userId}`;
    socket.join(room);
    console.log(`${socket.id} a rejoint la salle : ${room}`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message, role }) => {
    const receiverRoom = `${role}-${receiverId}`;
    io.to(receiverRoom).emit("receiveMessage", { senderId, message });
    console.log(`Message envoyé de ${senderId} à ${receiverRoom}`);
  });

  socket.on("disconnect", () => {
    console.log(`Déconnexion : ${socket.id}`);
  });
});

/* const gemini = new Gemini(process.env.GEMINI_API_KEY);
const chat = gemini.createChat();
console.log(await chat.ask("Tu me reçois")); */
// Routes

//Admin Routes
app.use("/api/admin", adminRoutes);

//Client Routes
app.use("/api/clients", clientsRoutes);

//Artisan Routes
app.use("/api/artisans", artisanRoutes);

//Likes Routes
app.use("/api/likes", likesRoutes);

//Commentaire Routes
app.use("/api/commentaire", commentaireRoutes);

//Routes for metiers
app.use("/api/metiers", metiersRoutes);

//Routes for search
app.use("/api/search", searchRoutes);

//Routes for rendezvous
app.use("/api/rendezvous", rendezvousRoutes);

//Routes for notes
app.use("/api/notes", notesRoutes);

//Routes for temoignages
app.use("/api/temoignages", temoignageRoutes);

//Routes for conversations
app.use("/api/conversations", ConversationRoutes);

//Routes for messages
app.use("/api/messages", MessageRoutes);

//Routes for localites
app.use("/api/localites", localitesRoutes);
// Routes for assets
app.use(
  "/assets/photos_artisans",
  express.static(path.join(__dirname, "/assets/photos_artisans"))
);
//app.use("/assets/photos_artisans", express.static(path.join(__dirname, "assets/photos_artisans")));

export default app;
