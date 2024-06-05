
import mongoose, { Document, Schema, model, models } from "mongoose";
import { IUser } from "./User.model";
import { IPost } from "./Post.model";

export interface IComment extends Document {
    map: any;
    _id:string,
    postId:IPost,
    text:string,
    createdAt:Date,
    commentor:IUser,
    childrens:Array<IComment>,
    likes:Array<string>
}

const CommentSchema=new Schema({

    postId:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }, 
    text:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    childrens:[{ 
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],
    commentor:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User',
        unique:true,
    }],
})

const Comment=models.Comment || model('Comment',CommentSchema);

export default Comment;
