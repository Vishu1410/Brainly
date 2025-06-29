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
import passport from "passport"
import session from "express-session"
import { Strategy as GoogleStrategy, Profile,VerifyCallback} from "passport-google-oauth20";


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



app.use(passport.initialize());


passport.use(new GoogleStrategy({
    clientID: process.env.clientID!,
    clientSecret: process.env.clientSecret!,
    callbackURL: "/auth/google/callback",
  }, async(accessToken : string, refreshToken : string , profile : Profile, done:VerifyCallback) => {
    // Save user to DB or create new
    try {
        const googleEmail = profile.emails?.[0]?.value;
        if(!googleEmail){
            return done(new Error("google email not found"),false);
        }

        let user = await UserModel.findOne({email:googleEmail});
        if(!user){
            await UserModel.create({
                email : googleEmail,
                googleId : profile.id,
                
            })
        }

       

        

        const token = jwt.sign(
            //@ts-ignore
            { id : user._id },
            process.env.JWT_SECRATE!,
            { expiresIn: "7d" }
            );
        
            // ✅ Use postMessage or redirect to send token
            const html = `
            <script>
                window.opener.postMessage({ token: "${token}" }, "http://localhost:5173/dashboard");
                window.close();
            </script>
            `;
            return done(null, { html });

        
        
        
    } catch (error) {
        console.error("google auth error : ",error);
        return done(error as any, false)
        
    }
    

  }));

  
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"],session : false }));

app.get("/auth/google/callback",
  passport.authenticate("google", { session:false, failureRedirect: "/login" }),
  async (req, res) => {
    // Successful login
    const { html } = req.user as any;
    res.send(html); 

    
    

    // Redirect to frontend with JWT in query
   
   
  }
);



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
        const Secret = process.env.JWT_SECRATE!

        const verifyUser = await UserModel.findOne({
            username : username
        })

        //@ts-ignore
        const matchPassword = await bcrypt.compare(password,verifyUser.password);
        console.log("this is match password : " + matchPassword)
        if(verifyUser && matchPassword){
            const token = jwt.sign({
                id : verifyUser._id
            },Secret)



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
        //@ts-ignore
        console.log(req.userId)
        
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
              
            
        } else if(link){
            fileurl = link
        }

        

        await ContentModel.create({
            title,
            description,
            type,
            fileurl : fileurl,
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