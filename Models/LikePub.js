import mongoose from "mongoose";

let LikePubSchema = mongoose.Schema({
  idPub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publications",
    required: true,
  },
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
  createdAt: { type: String, required: true },
});

const LikePub = mongoose.model("LikePub", LikePubSchema);

export default LikePub;
