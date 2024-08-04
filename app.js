import express from "express";
// import Gemini from "gemini-ai";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./Routes/adminRoutes.js";
import clientsRoutes from "./Routes/clientsRoutes.js";
import confirmationEmailRoutes from "./Routes/confirmationEmailRoutes.js";
import forgotPasswordRoutes from "./Routes/forgotPasswordRoutes.js";
import artisanRoutes from "./Routes/artisanRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";
import metiersRoutes from "./Routes/metiersRoutes.js";
import publicationsRoutes from "./Routes/publicationsRoutes.js";
import localitesRoutes from "./Routes/localitesRoutes.js";


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

//Confirmation Email Routes
app.use("/api/confirmation-email", confirmationEmailRoutes);

//Forgot Password Routes
app.use("/api/forgot-password", forgotPasswordRoutes);

//Routes for metiers
app.use("/api/metiers", metiersRoutes);

//Routes for publications
app.use("/api/clients/publications", publicationsRoutes);

//Routes for search
app.use("/api/search", searchRoutes);
//Routes for localites
app.use("/api/localites", localitesRoutes);
// Routes for assets
app.use(
  "/assets/photos_artisans",
  express.static(path.join(__dirname, "/assets/photos_artisans"))
);
//app.use("/assets/photos_artisans", express.static(path.join(__dirname, "assets/photos_artisans")));

export default app;
