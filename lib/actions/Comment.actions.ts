"use server"

import { connectToDB } from "../database";
import { ReplyCommentParams, addLikeToCommentParams, createCommentParams, deleteChildCmtParams, deleteCommentParams, updateCommentParams } from "../types";
import Comment, { IComment } from "../database/models/Comments.model";
import Post from "../database/models/Post.model";
import User from "../database/models/User.model";
import { revalidatePath } from "next/cache";

export const createComment=async({postId,userId,text,path}:createCommentParams)=> {

    try {
        await connectToDB();
        const newComment=await Comment.create({postId,commentor:userId,text})
        await Post.updateOne({_id:postId},{$push:{comments:newComment._id}});
        await User.updateOne({_id:userId},{$push:{replies:newComment._id}});
        
        const existComment=await Comment.findById(newComment._id)
            .populate({
                path:'commentor',
                model:User,
                select:"_id username photo"
            })
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existComment));
    } catch (error) {
        console.log(error);
    }
}

export const ReplyToComment=async({text,userId,path,commentId}:ReplyCommentParams)=> {

    try {
        await connectToDB();
        const newCmt=await Comment.create({text,commentor:userId})
        await User.updateOne({_id:userId},{$push:{replies:newCmt._id}});
        await Comment.updateOne({_id:commentId},{$push:{childrens:newCmt._id}})

        const existComment=await Comment.findById(newCmt._id)
            .populate({
                path:'commentor',
                model:User,
                select:"_id username photo"
            })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(existComment));
    } catch (error) {
        console.log(error);
    }
}

export const updateComment=async({id,text,path}:updateCommentParams)=> {

    try {
        await connectToDB();
        const cmt=await Comment.findByIdAndUpdate(id,{text},{new:true})
            .populate({
                path:'commentor',
                model:User,
                select:"_id username photo"
            })
        
        revalidatePath(path);
        console.log('update',cmt);
        return JSON.parse(JSON.stringify(cmt));
    } catch (error) {
        console.log(error);
    }
}

export const getCmtWithChilds=async(id:string,path:string)=> {

    try {
        await connectToDB();
        const newCmt=await Comment.findById(id)
            .populate({
                path:'childrens',
                model:Comment,
                populate:{
                    path:'commentor',
                    model:User,
                    options:{sort:{createdAt:-1}},
                    select:'_id username photo'
                }
            })
        
        console.log('getCmt',newCmt);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newCmt));
    } catch (error) {
        console.log(error);
    }
}

export const deleteChildCmt=async({id,path,cmtId}:deleteChildCmtParams)=>{

    try {
        await connectToDB();
        const newComment=await Comment.findByIdAndDelete(id);
        await User.updateOne({_id:newComment.commentor},{$pull:{replies:newComment._id}});
        await Comment.updateOne({_id:cmtId},{$pull:{childrens:newComment._id}});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newComment));
    } catch (error) {
        console.log(error);
    }
}

export const deleteComment=async({id,postId,path}:deleteCommentParams)=> {

    try {
        await connectToDB();
        const newComment=await Comment.findById(id)
            .populate({
                path:'childrens',
                model:Comment,
                populate:{
                    path:'commentor',
                    model:User,
                    select:'_id'
                }
            })
            .populate({
                path:'commentor',
                model:User,
                select:'_id'
            })

        await Post.updateOne({_id:postId},{$pull:{comments:newComment._id}});
        await User.updateOne({_id:newComment.commentor},{$pull:{replies:newComment._id}});

        if(newComment.childrens && newComment.childrens.length>0) {
            await Promise.all(
                newComment.childrens?.map(async(c:IComment)=> {
                    await User.updateOne({_id:c.commentor._id},{$pull:{replies:c._id}});
                    await Comment.findByIdAndDelete(c._id);
                })
            )
        }

        const cmt=await Comment.findByIdAndDelete(newComment._id);
        console.log('delete',cmt);

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newComment));
    } catch (error) {
        console.log(error);
    }
}

export const addLikeToComment=async({id,userId,path}:addLikeToCommentParams)=> {

    try {
        await connectToDB();
        const newComment=await Comment.findById(id);
        if(!userId) throw new Error('userId is required');
        if(!newComment) throw new Error('comment not found!')

        if(!newComment.likes.includes(userId)) {
            newComment.likes.push(userId);
            await newComment.save();
        }else{
            newComment.likes=newComment.likes.filter((l:string)=> l.toString() !==userId);
            await newComment.save();
        }
        console.log('likedCmt',newComment);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newComment));
    } catch (error) {
        console.log(error);
    }
}

export const getComment=async()=> {

    try {
        await connectToDB();
        
    } catch (error) {
        console.log(error);
    }
}

