import { IPost } from '@/lib/database/models/Post.model'
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import moment from 'moment'
import PostMapImages from './PostMapImages';
import PostOptions from './PostOptions';
import Loader from '../shared/Loader';
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
import { Trash2Icon } from 'lucide-react';


interface PostcardProps {
    post:IPost,
    type?:'profile' | 'thread',
    setDelPost?:Dispatch<SetStateAction<IPost | null>>;
    setSavedPosts?:Dispatch<SetStateAction<IPost[]>>;
}

const Postcard = ({post,type,setDelPost,setSavedPosts}:PostcardProps) => {
    if(!post) return <Loader />

    
  return (
    <section className={` py-2 mb-2 w-full shadow-sm ${type==='thread' && ' border rounded-xl border-gray-400 '}`}>
        <div className=''>
            <div className=' flex flex-col gap-2 '>
                <div className=' flex gap-2'>
                    <div className=' h-12 w-12 relative rounded-full overflow-hidden'>
                        <Image
                            src={post.creator.photo}
                            alt='image'
                            layout='fill'
                            className=' cursor-pointer border bg-white'
                        />
                    </div>
                    <div className=' flex-between w-full'>
                        <div className=' flex flex-col gap-0'>
                            <p className=' font-[550]'>{post.creator.username}</p>
                            <p className=' text-sm'>{moment(post.createdAt).fromNow()}</p>
                        </div>
                        {type==='profile' && (
                            <div className='ml-4 px-6'>
                                <AlertDialog>
                                    <AlertDialogTrigger className=''>
                                        <button className='  text-red-500 rounded-full flex gap-2 '>
                                            <Trash2Icon className=' h-5 w-5 flex' />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className='bg-white rounded-2xl dark:bg-dark-2 border-gray-50'>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel 
                                            className=' bg-gray-200 rounded-full border-none hover:bg-gray-300 dark:bg-gray-600'
                                        >
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={()=> setDelPost && setDelPost(post)}
                                            className=' bg-red-500 rounded-full text-white hover:bg-red-600'
                                        >
                                            Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                </div>
                <p className={` pl-8 text-[15px] text-wrap truncate text-clip w-fit max-w-md ${type==='thread' && ' max-w-xl'}`}>
                    {post.text}
                </p>
                <div className='  pl-8 flex gap-0 flex-col text-wrap text-clip w-fit'>
                    {post?.tags?.map((tag,i)=> (
                        <p className=' text-blue-600 text-sm' key={i}>#{tag} </p>
                    ))}
                </div>
                 <div className=' mx-8'>
                    <PostMapImages post={post} />
                 </div>
                 <PostOptions post={post} setSavedPosts={setSavedPosts} />
            </div>
        </div>
    </section>
  )
}

export default Postcard

