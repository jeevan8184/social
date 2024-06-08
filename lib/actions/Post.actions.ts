"use server"
import { connectToDB } from "../database";
import Post from "../database/models/Post.model";
import { addLikeToPostParams, createPostParams, getAllPostsParams, getAllUserPostsParams } from "../types";
import User from "../database/models/User.model";
import Comment, { IComment } from "../database/models/Comments.model";
import { revalidatePath } from "next/cache";

export const createPost=async({creator,text,images,tags,path='/'}:createPostParams)=> {

    try {
        await connectToDB();
        const newPost=await Post.create({creator,text,images,tags});
        
        await User.updateOne({_id:creator},{$push:{posts:newPost._id}});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newPost));
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts=async({limit=5,page=1,path}:getAllPostsParams)=> {

    try {
        await connectToDB();
        const skipAmt=(Number(page)-1)*limit;

        const allPosts=await Post.find()
            .sort({createdAt:'desc'})
            // .limit(limit)
            .skip(skipAmt)
            .populate({
                path:'creator',
                model:User,
                select:'_id username photo'
            })
            .exec()
        
        const allDocs=await Post.countDocuments();

        revalidatePath(path);
        return JSON.parse(JSON.stringify({
            allPosts,
            totalPages:Math.ceil(allDocs/limit)
        }));
        
    } catch (error) {
        console.log(error);
    }
} 

export const getAllUserPosts=async({userId,limit=5,page=1,path}:getAllUserPostsParams)=> {

    try {
        await connectToDB();
        const skipAmt=(Number(page)-1)*limit;

        const allPosts=await Post.find({creator:userId})
            .sort({createdAt:'desc'})
            // .limit(limit)
            .skip(skipAmt)
            .populate({
                path:'creator',
                model:User,
                select:'_id username photo'
            })
            .exec()
    
        revalidatePath(path);
        const allDocs=await Post.countDocuments();

        return JSON.parse(JSON.stringify({
            allPosts,
            totalPages:Math.ceil(allDocs/limit)
        }));
        
    } catch (error) {
        console.log(error);
    }
}

export const addLikeToPost=async({userId,postId,path}:addLikeToPostParams)=> {
    console.log('like',userId,postId);

    try {
        await connectToDB();
        const existPost=await Post.findById(postId);
        if(!userId) throw new Error('userid is required');
        if(!existPost) throw new Error('post is required');
        
        if(!existPost?.likes.includes(userId)) {
            existPost.likes.push(userId);
            await existPost.save();
        }else {
            existPost.likes=existPost.likes.filter((id:string)=> id.toString() !==userId);
            await existPost.save();
        }
        revalidatePath(path);
        console.log('like',existPost);
        return JSON.parse(JSON.stringify(existPost));
    } catch (error) {
        console.log(error);
    }
}

export const getPostWithId=async(postId:string,path:string)=>{

    try {
        await connectToDB();
        const existPost=await Post.findById(postId)
            .populate({
                path:'creator',
                model:User,
                select:'_id username photo '
            })
            .populate({
                path:'comments',
                model:Comment,
                options:{sort:{createdAt:-1}},
                populate:[
                    {
                        path:'childrens',
                        model:Comment,
                        options:{sort:{createdAt:-1}}
                    },
                    {
                        path:'commentor',
                        model:User,
                        select:'_id username photo'
                    }
                ]
            })
            revalidatePath(path);

        console.log('post',existPost.comments);
        return JSON.parse(JSON.stringify(existPost));
    } catch (error) {
        console.log(error);
    }
}

export const getPost=async(postId:string,path:string)=>{

    try {
        await connectToDB();
        const existPost=await Post.findById(postId)
            .populate({
                path:'creator',
                model:User,
                select:'_id username photo '
            })
        
        console.log('getPost',existPost);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existPost));
    } catch (error) {
        console.log(error);
    }
}

export const deletePost=async(postId:string,path:string)=> {

    try {
        await connectToDB();
        const post=await Post.findById(postId)
            .populate({
                path:'comments',
                model:Comment,
                populate:{
                    path:'childrens',
                    model:Comment
                }
            })
        
        await User.updateOne({_id:post.creator},{$pull:{posts:post._id}});

        if(post.comments && post.comments?.length>0 ) {
            await Promise.all(
                post.comments.map(async(cmt:IComment)=> {
                    if(cmt.childrens && cmt.childrens.length>0) {
                        await Promise.all(
                            cmt.childrens.map(async(c:IComment)=> {
                                await User.updateOne({_id:c.commentor},{$pull:{replies:c._id}});
                                await Comment.findByIdAndDelete(c._id);
                            })
                        )
                    }
                    await User.updateOne({_id:cmt.commentor},{$pull:{replies:cmt._id}});
                    await Comment.findByIdAndDelete(cmt._id);
                })
            )
        }
        
        await Post.findByIdAndDelete(post._id);

        console.log('deletePost',post);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.log(error);
    }
}

