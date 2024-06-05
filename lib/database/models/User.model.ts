
import mongoose, { Document, Schema, model, models } from "mongoose";
import { IPost } from "./Post.model";
import { IComment } from "./Comments.model";

export interface IUser extends Document {
    _id:string,
    username:string,
    authId:string,
    bio:string,
    createdAt:string,
    photo:string,
    friends:Array<IUser>,
    posts:Array<IPost>,
    saved:Array<IPost>,
    replies:Array<IComment>
}

const UserSchema=new Schema({
    username:{type:String,required:true,unique:true},
    authId:{
        type:Schema.Types.ObjectId,
        ref:'Auth',
        required:true
    },
    bio:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()},
    photo:{type:String,required:true},
    friends:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }],
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    saved:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    replies:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]
})

const User=models.User || model('User',UserSchema);

export default User;

