
import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./User.model";
import { IMessage } from "./Message.model";

export interface IChat extends Document {
    _id:string,
    participants:Array<IUser>,
    messages:Array<IMessage>
}

const ChatSchema=new Schema({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }],
    messages:[{
        type:Schema.Types.ObjectId,
        ref:'Message'
    }],
})

const Chat=models.Chat || model('Chat',ChatSchema);

export default Chat;
