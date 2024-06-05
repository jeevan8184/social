import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { MoreVerticalIcon } from 'lucide-react';
import { ChatContext } from '../Message/ChatContext';
import { IComment } from '@/lib/database/models/Comments.model';
import { IPost } from '@/lib/database/models/Post.model';
import { addLikeToComment, deleteChildCmt, deleteComment } from '@/lib/actions/Comment.actions';
import { usePathname } from 'next/navigation';

interface CommentOptionsProps {
    c:IComment,
    setComments:Dispatch<SetStateAction<IComment[]>>,
    post?:IPost,
    setReplyCmt?:Dispatch<SetStateAction<IComment | null>>;
    setEditCmt:Dispatch<SetStateAction<IComment | null>>;
    type?:'child',
    comment?:IComment
}

const CommentOptions = ({c,setComments,post,setReplyCmt,setEditCmt,type,comment}:CommentOptionsProps) => {

    const {currUser}=useContext(ChatContext);
    const pathname=usePathname();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<IComment["likes"]>([]);

    useEffect(()=> {
        setLikes(c?.likes)
        const isLiked=c?.likes?.some((l)=> l===currUser?._id);
        setLiked(isLiked);
    },[c]);

    const handleDelete=async()=>{
       try {
           if(post) {
                const newComment=await deleteComment({id:c._id,postId:post._id,path:pathname});
                if(newComment) {
                    setComments((comments)=> {
                        const newComments=comments.filter((comment)=> comment._id !== newComment._id);
                        return newComments;
                    })
                }
           }
       } catch (error) {
          console.log(error);
       }
    }

    const handleChildDelete=async()=>{

        try {
            if(comment) {
                const newComment=await deleteChildCmt({id:c._id,path:pathname,cmtId:comment._id});
                if(newComment) {
                    setComments((comments)=> {
                        const newComments=comments.filter((comment)=> comment._id !== newComment._id);
                        return newComments;
                    })
                }
           }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike=async()=>{
        
        try {
            const newComment=await addLikeToComment({id:c._id,userId:currUser?._id,path:pathname});
            setLikes(newComment?.likes);
            setLiked((prev)=> !prev);
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className=' flex gap-1'>
        <div className=' flex items-center gap-3 relative'>
            <div className=' flex gap-1'
                onClick={()=> handleLike()}
            >
                <Image
                    src={liked ? '/assets/icon/heart-filled.svg':'/assets/icon/heart-gray.svg'}
                    alt='image'
                    height={24}
                    width={24}
                    className=''
                />
                <p className={`${likes?.length>0 ? '':' hidden'}`}>{likes?.length}</p>
            </div>
            <div className={`relative ${(c.commentor?._id !==currUser?._id && type==='child' ) ? ' hidden':''}`}>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVerticalIcon className=' h-4 w-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className=' bg-white shadow-md rounded-xl absolute right-0 down
                        p-0 border-gray-300 border-opacity-45 ring-offset-0'
                    >
                        <div className=' flex flex-col gap-2 px-2'>
                            {currUser._id===c.commentor._id ? (
                                <div className=''>
                                    <DropdownMenuItem className=' cursor-pointer item' 
                                        onClick={()=>  setEditCmt(c)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger className=' pb-1 flex-start  text-sm item w-full '>Delete</AlertDialogTrigger>
                                        <AlertDialogContent className='bg-white dark:bg-dark-3 border border-gray-50'>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel 
                                                className=' cancel border-none dark:hover:bg-gray-800'
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={()=> type==='child' ? handleChildDelete():handleDelete()} 
                                                className=' bg-red-500 rounded-full text-white hover:bg-red-600'
                                            >
                                                Delete
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ):(
                                <div className=''>
                                    { type !=='child' ? (
                                        <DropdownMenuItem 
                                            className=' cursor-pointer'
                                            onClick={()=> setReplyCmt && setReplyCmt(c)}
                                        >
                                            Reply
                                        </DropdownMenuItem>
                                    ):null }
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </div>
  )
}

export default CommentOptions
