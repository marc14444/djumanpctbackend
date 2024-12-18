import express from "express";
// import Gemini from "gemini-ai";
import dotenv from "dotenv";
import cors from "cors";
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
import bodyParser from 'body-parser';


import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

//Routes for localites
app.use("/api/localites", localitesRoutes);
// Routes for assets
app.use(
  "/assets/photos_artisans",
  express.static(path.join(__dirname, "/assets/photos_artisans"))
);
//app.use("/assets/photos_artisans", express.static(path.join(__dirname, "assets/photos_artisans")));

export default app;
