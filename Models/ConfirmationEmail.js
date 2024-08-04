import mongoose from "mongoose";

let confirmationEmailSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

export default confirmationEmailSchema = mongoose.model(
  "ConfirmationEmail",
  confirmationEmailSchema
);
