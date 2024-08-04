import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: [true, "le username est obligatoire"] },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
