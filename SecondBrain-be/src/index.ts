import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { JWT_SECRATE } from "./config";
import { UserModel , ContentModel,TagsModel,LinkModel } from "./DB";
import { middleware } from "./middleware";
import { random } from "./utlis";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors())

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

app.post("/api/v1/content",middleware,async(req,res)=>{
    try{
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        await ContentModel.create({
            link : link,
            type : type,
            title : title,
            tags : [],
            //@ts-ignore
            userId : req.userId
        })
        res.send({
            "message" : "content added..."
        })
    } catch(e){
        res.send({
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


async function main(){
    await mongoose.connect("mongodb+srv://vishupathariya146:feAVWFbOQDkM9yUJ@cluster0.mfblv.mongodb.net/SecondBrain");
    app.listen(3000);
    console.log("i am listening...")
}
main()