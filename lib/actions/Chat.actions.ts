"use server";
import mongoose from "mongoose";
import { connectToDB } from "../database";
import Chat, { IChat } from "../database/models/Chat.model";
import { createChatParams, getChatWithIdParams, getUserSearchChatsParams } from "../types";
import Message, { IMessage } from "../database/models/Message.model";
import User, { IUser } from "../database/models/User.model";
import { revalidatePath } from "next/cache";
import Post from "../database/models/Post.model";
import { cache } from "react";

export const createChat=cache(async({senderId,receiverId}:createChatParams)=> {

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
})

export const getChatWithId=async({chatId,sender}:getChatWithIdParams)=> {

    try {
        await connectToDB();
        const existChat=await Chat.findById(chatId)
            .populate({
                path:'participants',
                model:User,
                select:'_id username photo bio'
            })
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
        .sort({_id:'desc'})
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

export const getUserSearchChats=async({userId,searchTerm,path}:getUserSearchChatsParams)=>{
    try {
        await connectToDB();
        const regex=new RegExp(searchTerm,"i");
        const conditions={
            $and:[
                {username:{$regex:regex}},
                {_id:{$ne:userId}}
            ]
        }
        const AllUsers=await User.find(conditions);

        const allChats=AllUsers.map(async(user:IUser)=> {
            const newChat=await Chat.findOne({participants:{$all:[userId,user?._id]}})
            .sort({_id:'desc'})
            .populate({
                    path:'participants',
                    model:User,
                    select:'_id username photo bio'
            })
            return newChat;
        })
        const newAllChats=await Promise.all(allChats);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newAllChats));
    } catch (error) {
        console.log(error);
    }
}

export const getChatLastMessage=async(chatId:string,path:string)=> {

    try {
        await connectToDB();
        const chat=await Chat.findById(chatId)
            .populate({
                path:'messages',
                model:Message,
            })
        if(chat.messages.length==0) return null;

        const recentMsg=chat.messages.sort((a:IMessage,b:IMessage)=> Number(b.createdAt)-Number(a.createdAt))[0];

        revalidatePath(path);
        return JSON.parse(JSON.stringify(recentMsg));
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
