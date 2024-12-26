import express from "express";
// import Gemini from "gemini-ai";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import i18next from './i18n.js'; // Importer la configuration i18next 
import i18nextMiddleware from 'i18next-http-middleware';
import connectDB from "./config/db.js";
import { setupSwagger } from './swagger.js';
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
import projetRoutes from "./Routes/projetRoutes.js";
import devisRoutes from "./Routes/devisRoutes.js";
import translationRoutes from "./Routes/languageRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";

import bodyParser from 'body-parser';


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration CORS 
app.use(cors({ origin: ['http://localhost:4000', 'https://djumanpctbackend.onrender.com'], credentials: true }));


app.use(express.json());
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));
app.use(express.urlencoded({ extended: false }));

//initalisé swagger
setupSwagger(app);

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

//Routes for projets
app.use("/api/projets", projetRoutes);

//Routes for devis
app.use("/api/devis", devisRoutes);

//Routes for localites
app.use("/api/localites", localitesRoutes);

//Routes for translations
app.use("/api/translations", translationRoutes);

//Routes for orders
app.use("/api/orders", orderRoutes);

//Routes for payments
app.use("/api/payments", paymentRoutes);

//routes pour la production
app.use("/api/production", (req, res) => {
  return res.status(200).json({
    message: "API de production toutes les routes de prodution ici",
    status: "ok",
  });
});

// Routes for assets
app.use(
  "/assets/photos_artisans",
  express.static(path.join(__dirname, "/assets/photos_artisans"))
);
//app.use("/assets/photos_artisans", express.static(path.join(__dirname, "assets/photos_artisans")));

export default app;
