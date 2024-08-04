import mongoose from "mongoose";

const searchSchema = mongoose.Schema({
  terms: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true },
});

const Search = mongoose.model("Search", searchSchema);

export default Search;
