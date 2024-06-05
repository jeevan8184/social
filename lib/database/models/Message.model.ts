
import { Schema, model, models } from "mongoose";
import { IPost } from "./Post.model";

export interface IMessage extends Document {
    _id:string,
    text:string,
    image:string,
    createdAt:Date,
    sender:string,
    receiver:string,
    reactions:Array<{emoji:string,userId:string}>,
    post:IPost
}

const MessageSchema=new Schema({

    text:{
        type:String,
    },
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    reactions:[{
        emoji:{
            type:String,
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    }],
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }
})

const Message=models.Message || model('Message',MessageSchema);

export default Message;
