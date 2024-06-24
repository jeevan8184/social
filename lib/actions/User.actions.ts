"use server"

import mongoose, { Mongoose } from "mongoose";
import { connectToDB } from "../database";
import User from "../database/models/User.model";
import { 
    CreateUserParams,
    addFriendParams, 
    fetchUserProps 
} from "../types";
import { revalidatePath } from "next/cache";
import { verifySession } from "../session";
import { cache } from "react";
import Post, { IPost } from "../database/models/Post.model";
import Comment from "../database/models/Comments.model";

export const getUserById=async(id:string,path:string)=> {

    try {
        await connectToDB();
        const existUser=await User.findById(id)
            .populate({
                path:'friends',
                model:User,
                select:'_id username photo bio'
            })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(existUser));
    } catch (error) {
        console.log(error);
    }
}

export const getUser=cache(async()=> {

    const session=await verifySession();
    if(!session) return null;

    try {
        await connectToDB();
        const existUser=await User.findOne({authId:session.authId})
            .populate({
                path:'friends',
                model:User,
                select:'_id username photo'
            })

        return JSON.parse(JSON.stringify(existUser));
        
    } catch (error) {
        console.log(error);
    }
})

export const createUser=async({username,bio,photo,path,id}:CreateUserParams)=> {
    const {authId}=await verifySession();

    console.log('photo',photo);
    try {
        await connectToDB();

        if(id) {
            const existUser=await User.findById(id);
            if(!existUser) throw new Error('user does not found');
            const newUser=await User.findByIdAndUpdate(existUser._id,{username,bio,photo},{new:true});
            revalidatePath(path);
            return JSON.parse(JSON.stringify(newUser));
        }else{
            const newUser=await User.create({
                username,bio,photo,authId
            });
            revalidatePath(path);
            console.log('newUser',newUser);
            return JSON.parse(JSON.stringify(newUser));
        }
    } catch (error) {
        console.log(error);
    }
}

export const fetchUsers=async({limit=10,query,page=1,path}:fetchUserProps)=> {
    const {authId}=await verifySession();

    try {
        await connectToDB();

        const regex=new RegExp(query,"i");
        const skipAmt=(Number(page)-1)*limit;

        const conditions={
            $and:[
                query? {username:{$regex:regex}} : {},
                {authId:{$ne:authId}}
            ]
        }

        const users=User.find(conditions)
            .sort({createdBy:'desc'})
            .limit(limit)
            .skip(skipAmt)
        
        const allUsers=await users.exec();
        const countDocs=await User.countDocuments(conditions);

        revalidatePath(path);
        
        return {
            data:JSON.parse(JSON.stringify(allUsers)),
            totalPages:Math.ceil(countDocs/limit)
        }
        

    } catch (error) {
        console.log(error);
    }
}

export const addFriend=async({userId,path}:addFriendParams)=> {
    const {authId}=await verifySession();

    try {
        await connectToDB();
        const existUser=await User.findOne({authId});
        
        if(!existUser.friends.includes(userId)) {
            existUser.friends.push(userId);
            await existUser.save();
        }else {
            existUser.friends=existUser.friends.filter((id: string)=> id.toString()!==userId);
            await existUser.save();
        }

        const user=await User.findOne(existUser._id)
            .populate({
                path:'friends',
                model:User,
                select:'_id username photo'
            })
        
        console.log('addfriend',user);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error);
    }
}

export const savePostToUser=async(postId:string,userId:string,path:string)=>{

    try {
        await connectToDB();
        const user=await User.findById(userId)
            .populate({
                path:'friends',
                model:User,
                select:'_id username photo'
            })
            
        const post=await Post.findById(postId);
        if(!post) throw new Error('post not found with that id');
        
        if(!user?.saved?.includes(post._id)){
            user.saved.push(post._id);
            await user.save();
        }else{
            user.saved=user?.saved.filter((s:string)=> s.toString()!==post._id.toString());
            await user.save();
        }

        revalidatePath(path);
        console.log('user',user);
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error);
    }
}

export const getUserSavedPosts=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const user=await User.findById(userId)
            .populate({
                path:'saved',
                model:Post,
                populate:{
                    path:'creator',
                    model:User,
                    select:'_id username photo'
                }
            })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(user.saved));
    } catch (error) {
        console.log(error);
    }
}

export const getRepliesOfUser=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const user=await User.findById(userId)
            .populate({
                path:'replies',
                model:Comment,
                match:{postId:{$exists:true}},
                options:{sort:{createdAt:-1}},
                populate:[
                    {
                        path:'commentor',
                        model:User,
                        select:'_id username photo'
                    },
                    {
                        path:'postId',
                        model:Post,
                        populate:{
                            path:'creator',
                            model:User,
                            select:'_id username photo'
                        }
                    }
                ]
            })

            const allReplies=user.replies.reduce((acc: any,reply: any)=> {
                const existsIdx=acc.findIndex((post:any)=> post.postId._id===reply.postId._id);
                if(existsIdx === -1) {
                    acc.push({postId:reply.postId,comments:[reply]});
                }else{
                    acc[existsIdx].comments.push(reply);
                }
                return acc;
            },[]);
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(allReplies));
    } catch (error) {
        console.log(error);
    }
}

