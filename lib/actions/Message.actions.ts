"use server";

import mongoose from "mongoose";
import { connectToDB } from "../database";
import Message, { IMessage } from "../database/models/Message.model";
import { addReactionsMsgParams, createMessageParams, createMessagePostParams } from "../types";
import Chat from "../database/models/Chat.model";
import { revalidatePath } from "next/cache";
import User from "../database/models/User.model";
import Post from "../database/models/Post.model";

export const createMessage=async({text,senderId,receiverId,path,image}:createMessageParams)=> {

    try {
        await connectToDB();
        const condition={participants:{$all:[senderId,receiverId]}}

        const newMsg=await Message.create({text,sender:senderId,receiver:receiverId,image});
        await Chat.updateOne(condition,{$push:{messages:newMsg._id}});

        revalidatePath(path);
        console.log('newMsg',newMsg);
        return JSON.parse(JSON.stringify(newMsg));
    } catch (error) {
        console.log(error);
    }
}

export const createMessagePost=async({text,senderId,receiverId,path,image,post}:createMessagePostParams)=> {

    try {
        await connectToDB();
        const condition={participants:{$all:[senderId,receiverId]}}

        const newMsg=await Message.create({text,sender:senderId,receiver:receiverId,image,post});
        await Chat.updateOne(condition,{$push:{messages:newMsg._id}});

        const message=await Message.findById(newMsg._id)
            .populate({
                path:'post',
                model:Post,
                populate:{
                    path:'creator',
                    model:User,
                    select:'_id username photo'
                }
            })

        console.log('message',message);

        revalidatePath(path);
        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        console.log(error);
    }
}


export const deleteMessages=async(msgs:IMessage[])=> {

    try {
        await connectToDB();
        const ids=msgs.map((m)=> m._id)
        await Message.deleteMany({_id:{$in:ids}});

        await Promise.all(
            msgs.map((msg)=> (
                 Chat.updateMany(
                    {messages:{$in:msg._id}},
                    {$pull:{messages:msg._id}}
                )
            ))
        )
        return {message:'ok'}
    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage=async(id:string)=> {

    try {
        await connectToDB();
        const newMsg=await Message.findByIdAndDelete(id);
        
        if(newMsg) {
            await Chat.updateMany(
                {messages:{$in:newMsg._id}},
                {$pull:{messages:newMsg._id}}
            )
        }
        
        return {message:'ok'};
    } catch (error) {
        console.log(error);
    }
}

export const getMessageReactions=async(id:string)=> {

    try {
        await connectToDB();
        const existMsg=await Message.findById(id)
            .populate({
                path:'reactions',
                populate:{
                    path:'userId',
                    model:User,
                    select:'_id username photo '
                }
            })
        return JSON.parse(JSON.stringify(existMsg));
    } catch (error) {
        console.log(error);
    }
}

export const addReactionsMsg=async({userId,emoji,id}:addReactionsMsgParams)=> {

    try {
        await connectToDB();
        await Message.updateOne({_id:id},{$push:{reactions:{emoji,userId}}});

        const existMsg=await Message.findById(id);

        console.log('addRxnMsg',existMsg);
        return JSON.parse(JSON.stringify(existMsg));
    } catch (error) {
        console.log(error);
    }
}

export const deleteReactionsMsg=async({userId,emoji,id}:addReactionsMsgParams)=> {

    try {
        await connectToDB();
        const existMsg=await Message.findByIdAndUpdate(id,
            {$pull:{reactions:{emoji,userId}}},
            {new:true}
        )

        return JSON.parse(JSON.stringify(existMsg));
    } catch (error) {
        console.log(error);
    }
}

