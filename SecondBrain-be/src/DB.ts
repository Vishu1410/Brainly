import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;


const user = new Schema({
    // manuall login
    username: {
    type: String,
    unique: true,
    
    },

    password: {
    type: String,
    required : true // don’t return password by default
    },

    // google login

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    
    googleId: {
        type: String,
        unique: true,
        sparse: true, // allows null if not using Google login
      },

      accessToken: String,
      refreshToken: String,
  
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
  
})




const content = new Schema({
    title: { type: String, required: true },
    description : {type : String},
    type : {type : String,enum : ['text','youtube','twitter','image','video','file']},
    fileurl : String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tags' }],
    createdAt : {type : Date ,default : Date.now()},
    userId: { type: mongoose.Types.ObjectId, ref: 'UserModel', required: true },
    shareToken : {type:String, unique: true, sparse:true}
})



const tags = new Schema({
    title : {type : String, require:true}
})

const link = new Schema({
    hash : String,
    userId : {type:mongoose.Types.ObjectId,ref:'UserModel',required : true,unique:true}
})

export const UserModel = model("UserModel",user);
export const ContentModel = model("ContentModel",content);
export const TagsModel = model("TagsModel",tags);
export const LinkModel = model("LinkModel",link);