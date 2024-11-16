require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose")
mongoose.connect(config.connectionString)
const User = require('./models/user.js');
const Note = require('./models/notes.js')
const express = require("express")
const cors = require("cors")
const app = express()
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('./utilities');
app.use(express.json())
app.use(
    cors({
        origin:'*',
    })
)
app.get("/",(req,res)=>{
    res.json({
        data:"Nothing to see here"
    })
})
//user registration APIs
//register user API man
app.post("/create-account",async (req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName){
        return res.status(400).json({error:true,message:"Name is required"})
    }
    if(!email){
        return res.status(400).json({error:true,message:"email is required"})
    }
    if(!password){
        return res.status(400).json({error:true,message:"password is required"})
    }
    const isUser = await  User.findOne({email:email});
    if(isUser){
        return res.json({
            error:true,
            message:"User already exists",
        })
    }
    const user = new User({
        fullName,
        email,
        password
    })

    await user.save();

    const accessToken = jwt.sign(
        {user},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",
        }
    )
    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Successful"
    })
})

//login API
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"})

    }
    if(!password){
        return res.status(400).json({message:"Please enter the password"})
    }
    const userInfo = await User.findOne({email:email})
    if(!userInfo){
        return res.status(401).json({message:"The user does not exist"})
    }
    
    if (userInfo.email == email && userInfo.password == password){
        const user = {user:userInfo}
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m"
        })
        return res.json({
            error:false,
            message:"Login Successfull",
            email,
            accessToken
        })
    }
    else{
        return res.status(400).json({
            error:true,
            message:"Invalid credentials"
        })
    }
})
app.get("/get-user",authenticateToken,async(req,res)=>{
    console.log("API hitted")
    const {user} = req.user;
    const isUser = await  User.findOne({_id:user._id});
    if(!isUser){
       return res.send(401).send("No such User found") 
    }
    return res.json({
        user:{
            fullName:isUser.fullName,
            email:isUser.email,
            createdOn:isUser.createdOn
        },
        message:"Here's our user"

    })
})
//This section is for defining or manipulating notes







app.get("/note-search/",authenticateToken,async (req,res)=>{
    const {user} = req.user;
    const {query} = req.query;
    if(!query){
        return res.status(400).json({error:true, message:"Search is necessary"});
    }
    try{
        const matchingNotes = await Note.find({
            userId : user._id,
            $or : [
                {title:{$regex: new RegExp(query,"i")}},
                {content: {$regex: new RegExp(query,"i")}}
            ]
        });
        return res.json ({error:false,
        notes:matchingNotes,
        message: "Notes are here man"
        })

    }catch(err){
        return res.status(500).json({
            error:true,
            message:"Server side error"
        })
    }
})
//add note API man
app.post("/note-add",authenticateToken,async (req,res)=>{
    const {title,content,tags,isPinned} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error:true, message:"Title is required"})

    }
    if(!content){
        return res.status(400).json({error:true, message:"Content cannot be empty"})
    }
    try{
        const note = new Note({
            title,
            content,
            tags:tags||[],
            isPinned,
            userId: user._id
        })
        await note.save()

        return res.json({
            error:false,
            note,
            message:"This Note was added"
        })
    }catch(err){
        console.log(err)
        return res.status(400).json({
            error:true,
            message:"Server side error"
        })
    }
})

//edit note API
app.put("/note-edit/:noteId",authenticateToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body;
    const {user} = req.user;
    console.log(user)
    console.log("API works")
    if(!title && !content && !tags ){
        return res.status(400).json({error:true,message: "no changes provided here"});
    }
    try{
        
        const note = await Note.findOne({_id:noteId,userId:user._id});
        console.log(note)
        if(!note){
            return res.status(404).json({error:true, message:"note not found here"})
        }
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save()

        return res.json({
            error:false,
            note,
            message:"Note updated"
        })

    }catch(err){
        return res.status(500).json({
            error:true,
            message:"Server side error"
        })
    }
})


//Get all Notes
app.get("/get-notes",authenticateToken,async (req,res)=>{
    const {user} = req.user;
    try{
        const notes = await Note.find({userId:user._id}).sort({isPinned: -1});
        
        return res.json({
            error:false,
            notes,
            message:"All the notes are here"
        })
    }catch(error){
         return res.status(500).json({
            error:true,
            message:'Server Error'
         })   
    }
})

app.delete('/delete-note/:noteId',authenticateToken,async (req,res)=>{
    const noteId = req.params.noteId;
    const {user} = req.user;
    try{
        const note = await Note.findOne({_id:noteId,userId:user._id});
        console.log(note)
        if(!note){
            return res.status(404).json({error:true,message:"No note like this"})
        }
        await Note.deleteOne({_id:noteId,userId:user._id});
        
        return res.json({
            error:false,
            message:"Note deleted successfully",
        })
    }catch(err){
        return res.status(500).json({
            error:true,
            message:"Server Side error"
        })
    }
})


//pin or unpin the note API
app.put("/pin-update/:noteId",authenticateToken,async (req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;
    console.log(user)
    console.log("API works")
    
    try{
        
        const note = await Note.findOne({_id:noteId,userId:user._id});
        console.log(note)
        if(!note){
            return res.status(404).json({error:true, message:"note not found here"})
        }
        note.isPinned = isPinned;

        await note.save()

        return res.json({
            error:false,
            note,
            message:"Note updated"
        })

    }catch(err){
        return res.status(500).json({
            error:true,
            message:"Server side error"
        })
    }
})

app.listen(5000,()=>{
    console.log("Listening on PORT 5000....")
    
})

module.exports = app;