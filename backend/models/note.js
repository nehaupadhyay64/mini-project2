import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true,
    trim: true
  },
  content:{
    type:String,
    required: true
  },
  author:{
    type: String,
    default: "Anonymous"
  },
  createdAt:{
    type:Date,
    default: Date.now
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});
const Note = mongoose.model("Note",noteSchema);
export default Note;