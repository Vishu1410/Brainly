import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { UserModel , ContentModel,TagsModel,LinkModel } from "./DB";
import { middleware } from "./middleware";
import { random } from "./utlis";
import cors from "cors"
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary";
import { uploads } from "./multermiddleware/multermiddleware";
import connectToMongo from "./db/connectToMongo";


dotenv.config()
const app = express();

app.use(express.json());
app.use(cors())



const PORT = process.env.PORT || 3000
const JWT_SECRATE = process.env.JWT_SECRATE!;

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });




app.post("/api/v1/signup",async (req,res)=>{
    try{    
        const username = req.body.username;
        const password = req.body.password;
        const hashpassword = await bcrypt.hash(password,10);
        await UserModel.create({
            username : username,
            password : hashpassword
        })
        res.json({
            message : "signup Sucessfull..."
        })
    }catch(e){
        res.send({
            error : e
        })
    }
    
})


app.post("/api/v1/login",async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const verifyUser = await UserModel.findOne({
            username : username
        })
        //@ts-ignore
        const matchPassword = bcrypt.compare(password,verifyUser.password);
        if(verifyUser && matchPassword){
            const token = jwt.sign({
                id : verifyUser._id
            },JWT_SECRATE)

            res.send({
                Authorization : token
            })
        }else{
            message : "incorrect cred..."
        }
        
    } catch(e){
        res.send({
            Error : e
        })
    }
})

app.post("/api/v1/content",middleware,uploads,async(req,res)=>{
    try{
        
        const file = req.file as Express.Multer.File;
        const {title,description,type,link} = req.body;
        

        let fileurl = null;
        let resourceType: "auto" | "raw";

        if(file){

            if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                resourceType = "raw";
              } else{
                resourceType = "auto"
              }
              
              const result = await cloudinary.uploader.upload(file.path, {
                folder : "upload-doc",
                resource_type: resourceType,
              });
              fileurl = result.secure_url
              
            
        }

        

        await ContentModel.create({
            title,
            description,
            type,
            fileurl : fileurl || null,
            link : link || null,
            //@ts-ignore
            userId : req.userId
        })

        res.status(201).send({
            "message" : "content added..."
        })

    } catch(e){
        console.error("something wrong", e);
        res.status(500).send({
            "error" : e 
        })
    }
})


app.get("/api/v1/content",middleware,async (req,res)=>{
    
    try{
        // @ts-ignore
        const userId = req.userId;
        const content = await ContentModel.find({
            userId : userId
        }).populate("userId", "username")
        
        res.json({
            content
        })
    } catch(e){
        res.send({
            "error " : e
        })
    }
})


app.delete("/api/v1/delete/:id",middleware,async(req,res)=>{
    const contentId = req.params.id;
    await ContentModel.findByIdAndDelete(contentId)
    res.status(200).json({
        "message" : "content deleted..."
    })
})

app.post("/api/v1/brain/share",middleware,async(req,res)=>{
    const share = req.body.share;
    if(share){

        const existingUser = await LinkModel.findOne({
            //@ts-ignore
            userId : req.userId
        })
        if(existingUser){
            res.json({
                hash : existingUser.hash
            })
            return
        }


        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId : req.userId,
            hash : hash
        })
        res.json({
            hash
        })
    }
})

app.get("/api/v1/brain/:sharelink",async(req,res)=>{
    //@ts-ignore
    const hash = req.params.sharelink;
    const link = await LinkModel.findOne({
        hash
    })

    if(!link){
        res.status(411).json({
            "message" : "sorry incorrect input..."
        })
        return
    }

    const content = await ContentModel.find({
        userId : link.userId
    })

    const user = await UserModel.findOne({
        _id : link.userId
    })

    if(!user){
        res.status(411).json({
            message : "user Not found...ideally should not happen..."
        })
        return
    }
    res.json({
        username : user.username,
        content : content
    })

})


app.listen(PORT,()=>{
    connectToMongo()
    console.log(`i am listening...at port ${PORT}`)
})