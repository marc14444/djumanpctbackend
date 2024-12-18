import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Le username est obligatoire"] },
  password: { type: String, required: true },
  role: { type: String, required: false, default: "admin" },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
