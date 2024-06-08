
import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IUser } from './User.model';
import { IComment } from './Comments.model';

export interface IPost extends Document {
    _id:string,
    images:Array<string>,
    creator:IUser,
    createdAt:Date,
    text:string,
    likes:Array<string>,
    comments:Array<IComment>,
    tags:Array<string>
} 

export const PostSchema=new Schema({
    images:[{
        type:String
    }],
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    text:{type:String},
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }],
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment',
    }],
    tags:[{
      type:String  
    }],
})

const Post=models.Post || model('Post',PostSchema);

export default Post;
