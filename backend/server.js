import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import Note from "./models/note.js";

const PORT=5000;
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB connected"))
.catch((err)=> console.log("MongoDB error:",err));

app.post("/add",async(req,res)=>{
    try{
        const{title, content,author} = req.body;
        const note = new Note({title,content,author});
        await note.save();
        res.status(201).json({message: "Note saved",note});
    }catch(err){
        res.status(400).json({error:err.message});
    }
        });
app.get("/all",async(req,res)=>{
    try{
        const notes = await Note.find().sort({createdAt: -1});
        res.json(notes);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});
app.get("/note/:id",async(req,res)=>{
    try{
const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
    }
});
app.put("/note/:id",async(req,res)=>{
    try{
      const{title,content,author} = req.body;
      const note = await Note.findByIdAndUpdate(req.params.id,
        {title,content,author,updatedAt:Date.now()},
        {new:true,runValidators:true}
      );
      if(!note) return res.status(404).json({error:"Note not found"});
      res.json({message:"Note Updated",note});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});




