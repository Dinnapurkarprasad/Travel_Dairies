import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs"
import path from 'path';
import { fileURLToPath } from "url";

import config from './config.json' assert { type: 'json' };
const app = express();
const port = 3000;

import { authenticateToken } from './utilities.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "./models/user.model.js"
import TravelStory from './models/travelStory.model.js';
import upload from './multer.js';
import { error } from 'console';


mongoose.connect(config.connectionString);


app.use(express.json());
app.use(cors({ origin: "*" }));


//Create Account
app.post("/create-account", async (req, res) => {
    const {fullName,email,password}=req.body

    if(!fullName || !email || !password){
        return res.status(400).json({error:true,message:"All fields are requrired"})
    }

    const isUser=await User.findOne({email});
    if(isUser){
       return res.status(400).json({error:true,message:"user alreday exists"})
    }
    const hashPassword=await bcrypt.hash(password,10);

    const user=new User({
        fullName,email,password:hashPassword
    })
    await user.save();

    const accessToken=jwt.sign(
           {userId:user._id},
           process.env.ACCESS_TOKEN_SECRET,
           {
            expiresIn:"72h"
           }

    )
    return res.status(201).json({
        error:false,
        user:{fullName:user.fullName,email:user.email},
        accessToken,
        message:"Registration successfull"

    })
});

//Login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"Email and passsword is reuired"});
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const isPasswordValid=await bcrypt.compare (password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid Credentails"});
    }

    const accessToken=jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h"
        }
    )
    return res.status(200).json({error:false,message:"User Login Successfully",user:{
          fullName:user.fullName,
          email:user.email},accessToken})
})

//Get User
app.get("/get-user",authenticateToken,async(req,res)=>{

    const{userId}=req.user

    const isUser=await User.findOne({_id:userId});

    if(!isUser){
        return res.sendStatus(401);
    }
    return res.json({
        user:isUser,
        message:""
    })
})

//Add Travel Story
app.post("/add-travel-story",authenticateToken,async(req,res)=>{

    const{title,story,visitedLocation,imageUrl, visitedDate}=req.body;
    const{userId}=req.user

    //validate required fileds
    if(!title || !story || ! visitedDate || ! imageUrl || !visitedDate){
        return res.status(400).json({error:true,message:"All fields are required"})
    }

    const parsedVisitedDate=new Date(parseInt(visitedDate))
    
    try {
        const travelStory=new TravelStory({
          title,
          story,
          visitedLocation,
          userId,
          imageUrl,
          visitedDate:parsedVisitedDate
        })
        await travelStory.save();
        res.status(201).json({story:travelStory,message:"Your Travel Story is live."})
    } catch (error) {
        res.status(400).json({error:true,message:error.message})
    }
})

//get all Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    
    try {
        
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//route to handle image uplode
app.post("/image-upload",upload.single("image"),async(req,res)=>{
   try {
    if(!req.file){
        return res.status(400).json({error:true,message:"No image uploaded"})
    }
    const imageUrl=`http://localhost:3000/uploads/${req.file.filename}`
    return res.status(200).json({imageUrl})
   } catch (error) {
      res.status(500).json({error:true,message:error.message})
   }
})

//Delete an image form uploads folder
app.delete("/delete-image",async(req,res)=>{
    const {imageUrl}=req.query;

    if(!imageUrl){
        return res.status(400).json({error:true,message:"ImageUrl is requried"})
    }

    try {
        const filename=path.basename(imageUrl)
        
        const filePath=path.join(__dirname,"uploads",filename)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
            res.status(200).json({message:"Image is succssgully deleted."})
        }
        else{
            res.status(200).json({error:true,message:"Image not found"})
        }

    } catch (error) {
        res.status(500).json({error:true,message:error.message})
    }
})

//Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//edit Travel story
app.put("/edit-story/:id",authenticateToken,async(req,res)=>{
    const {id}=req.params;
    const {title,story,visitedLocation,imageUrl,visitedDate}=req.body;
    const{userId}=req.user;

    //validate required fileds
    if(!title || !story || ! visitedDate || !visitedDate){
        return res.status(400).json({error:true,message:"All fields are required"})
    }

    const parsedVisitedDate=new Date(parseInt(visitedDate))

    try {
        const travelStory=await TravelStory.findOne({_id:id,userId:userId});

        if(!travelStory){
            return res.status(404).json({error:true,message:"Travel story not found"})
        }
        
        const placeholderImgurl=`http://localhost:3000/assets/img.webp`

        travelStory.title=title,
        travelStory.story=story,
        travelStory.visitedLocation=visitedLocation,
        travelStory.imageUrl= imageUrl ||placeholderImgurl,
        travelStory.visitedDate=parsedVisitedDate

        await travelStory.save();
        res.status(200).json({story:travelStory,message:"updated successfully"})

    } catch (error) {
        res.status(500).json({error:true,message:error.message})
    }
})

//Delete Travel stories
app.delete("/delete-story/:id",authenticateToken,async(req,res)=>{

    const{id}=req.params;
    const {userId}=req.user;

    try {
       
        const travelStory=await TravelStory.findOne({_id:id,userId:userId});

        if(!travelStory){
            return res.status(404).json({error:true,message:"Travel story not found"})
        }
         //delete the story from database
        await travelStory.deleteOne({_id:id,userId:userId})
       
        // Extract the file path
        const imageUrl=travelStory.imageUrl;
        const filename=path.basename(imageUrl)
        
        //Define file path
        const filePath=path.join(__dirname,"uploads",filename);
        
        //Delete the image form the uploads folder
        fs.unlink(filePath,(err)=>{
            if(err){
                console.error("Falied to delete image files:",err)
            }

        })
        res.status(200).json({message:"Travel story delete successfully."})

    } catch (error) {
        res.status(400).json({error:true,message:error.message})
        
    }


})

//update isFav
app.put("/update-is-fav/:id",authenticateToken,async(req,res)=>{

    const {id}=req.params;
    const {isFavourite}=req.body;
    const {userId}=req.user

    try {
        const travelstory=await TravelStory.findOne({_id:id,userId:userId})

        if(!travelstory){
            res.status(400).json({error:true,message:"Travel story not found"})
        }
        travelstory.isFavourite=isFavourite;
        // travelstory.count++;
        await travelstory.save();
        res.status(200).json({story:travelstory,message:"Updated Sccessfully"})
    } catch (error) {
        res.status(500).json({error:true,message:error.message})
    }
})

app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;  
  
    if (!query) {
      return res.status(400).json({ error: true, message: "Query is required" });  // 400 for bad request
    }
  
    try {
      const searchResults = await TravelStory.find({
        userId: userId,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { story: { $regex: query, $options: "i" } },
          { visitedLocation: { $elemMatch: { $regex: query, $options: "i" } } }
        ],
      }).sort({ isFavourite: -1 });  // Sort by isFavourite
  
      res.status(200).json({ stories: searchResults });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  });

//filter travel stories by date range
app.get("/travel-stories/filter",authenticateToken,async(req,res)=>{
    const {startDate,endDate}=req.query;
    const {userId}=req.user;

    try {
        //Convert startDate and endDate from milisec to Date Object

        const start=new Date(parseInt(startDate));
        const end=new Date(parseInt(endDate))

        //find the travel stories that belongs to the user and fall in the range of the start and end date
        
        const filteredStories=await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start,$lte:end},
        }).sort({isFavourite:-1});


        res.status(200).json({stories:filteredStories});
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
