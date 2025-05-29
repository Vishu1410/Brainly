import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;


const user = new Schema({
   username : { type:String,unique : true },
   password  :String
})




const content = new Schema({
    link: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tags' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'UserModel', required: true },
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