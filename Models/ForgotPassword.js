import mongoose from "mongoose";

const forgotPasswordSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

export default ForgotPassword;
