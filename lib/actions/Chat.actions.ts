"use server";
import mongoose from "mongoose";
import { connectToDB } from "../database";
import Chat, { IChat } from "../database/models/Chat.model";
import { createChatParams, getChatWithIdParams } from "../types";
import Message, { IMessage } from "../database/models/Message.model";
import User from "../database/models/User.model";
import { revalidatePath } from "next/cache";
import Post from "../database/models/Post.model";

export const createChat=async({senderId,receiverId}:createChatParams)=> {

    try {
        await connectToDB();
        const condition={participants:{$all:[senderId,receiverId]}};

        const existChat=await Chat.findOne(condition);
        if(existChat) return JSON.parse(JSON.stringify(existChat));

        const newChat=await Chat.create({participants:[senderId,receiverId]});
        if(newChat) return JSON.parse(JSON.stringify(newChat));

    } catch (error) {
        console.log(error);
    }
}

export const getChatWithId=async({chatId,sender}:getChatWithIdParams)=> {

    try {
        await connectToDB();
        const existChat=await Chat.findById(chatId)
            .populate({
                path:'participants',
                model:User,
                select:'_id username photo bio'
            })
        console.log('message page',existChat);
        return JSON.parse(JSON.stringify(existChat));
    } catch (error) {
        console.log(error);
    }
}


export const getChatMessages=async(chatId:string)=> {

    try {
        await connectToDB();
        const existChat=await Chat.findById(chatId)
            .populate({
                path:'messages',
                model:Message,
                populate:{
                    path:'post',
                    model:Post,
                    populate:{
                        path:'creator',
                        model:User,
                        select:'_id username photo'
                    }
                }
            })
        
        return JSON.parse(JSON.stringify(existChat));
        
    } catch (error) {
        console.log(error);
    }
}
 
export const getUserChats=async(id:string,path:string)=> {

    try {
        await connectToDB();

        const userObj=new mongoose.Types.ObjectId(id);
        const allChats=await Chat.find({participants:{$in:[userObj]}})
            .sort('desc')
            .populate({
                path:'participants',
                model:User,
                select:'_id username photo bio'
            })
        revalidatePath(path);
        return JSON.parse(JSON.stringify(allChats));
        
    } catch (error) {
        console.log(error);
    }
}

export const getChatLastMessage=async(chatId:string)=> {

    try {
        await connectToDB();
        const chat=await Chat.findById(chatId)
            .populate({
                path:'messages',
                model:Message,
            })

        if(chat.messages.length==0) return null;
        const lastMsg=chat.messages.sort((a:IMessage,b:IMessage)=>  new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())[0];

        return JSON.parse(JSON.stringify(lastMsg));

    } catch (error) {
        console.log(error);
    }
}

export const deleteChats=async(delChats:IChat[],path:string)=> {

    try {
        await connectToDB();
        console.log('delChats',delChats);

        await Promise.all(
            delChats.map((chat)=> {
                Message.deleteMany({_id:{$in:chat.messages}}).exec();
            })
        )
        const delIds=delChats.map((d)=> d._id);
        await Chat.deleteMany({_id:{$in:delIds}}).exec();

        revalidatePath(path);

        return {message:'ok'}

    } catch (error) {
        console.log(error);
    }
}
