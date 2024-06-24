
import React, { Dispatch, SetStateAction } from 'react'
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
import Image from 'next/image';
import moment from 'moment';
import PostOptions from './PostOptions';
import Loader from '../shared/Loader';
import { IPost } from '@/lib/database/models/Post.model';
import { useRouter } from 'next/navigation';

interface threadProps {
    post:IPost,
    type?:'profile',
    setDelPost?:Dispatch<SetStateAction<IPost | null>>;
    setSavedPosts?:Dispatch<SetStateAction<IPost[]>>;
}

const Threads = ({post,type,setDelPost,setSavedPosts}:threadProps) => {
    if(!post) return <Loader />

    const router=useRouter();
    

  return (
        <section className=' px-4 max-sm:px-0.5 py-2 flex flex-col gap-1 overflow-hidden'>
            <div className=' flex gap-2'>
                <div className=' flex-between flex-col gap-0.5'>
                    <div className=''>
                        <div className=' h-12 w-12 relative rounded-full overflow-hidden'>
                            <Image
                                src={post.creator.photo}
                                alt='image'
                                layout='fill'
                                className=' cursor-pointer border bg-white'
                            />
                        </div>
                    </div>
                    <div className=' h-full bg-grey-500 rounded-full w-0.5' />
                </div>
                <div className=' w-full'>
                    <div className=' w-full flex-between max-sm:pr-4'>
                        <div className=' flex flex-col gap-0'>
                            <p className=' font-[550]'>{post?.creator?.username}</p>
                            <p className='text-sm text-[14px] text-gray-600'>{moment(post?.createdAt).fromNow()}</p>
                        </div>
                        <div className=''>
                        {type==='profile' && (
                            <div className='ml-4 px-6'>
                                <AlertDialog>
                                    <AlertDialogTrigger className=''>
                                        <button className='  text-red-500 rounded-full'>
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
                    <div className=''>
                        <p className=' max-sm:-ml-3 mt-2 text-[15px] w-full text-wrap whitespace-normal '>{post?.text}</p>
                    </div>
                    {post?.tags?.map((tag,i)=> (
                        <p className=' text-blue-600 text-sm' key={i}>#{tag} </p>
                    ))}
                    <div className=' -ml-8  max-sm:-ml-12'>
                        <PostOptions post={post} setSavedPosts={setSavedPosts} /> 
                    </div>
                </div>
            </div>
            <div className=' flex gap-4 items-center'>
                <div className=' ml-8 mt-2 flex items-center gap-2'>
                    {/* { avatarImages.map((img)=> (
                        <Image
                            src={img}
                            alt='image'
                            height={30}
                            width={30}
                            className=' rounded-full object-cover bg-center -ml-5'
                        />
                    ))} */}
                </div>
                {post?.comments.length>0 && (
                    <div className=' text-blue-500 cursor-pointer text-sm'
                        onClick={()=> router.push(`/comment?postId=${post?._id}`) }
                    >
                        {post?.comments.length>1 ? `${post?.comments.length} Replies` : `${post?.comments.length} Reply` }
                    </div>
                )}
            </div>
        </section>
  )
}

export default Threads

{/* <div className='ml-1 mt-3 flex items-center gap-2'>
{comments.slice(0, 2).map((comment, index) => (
  <Image
    key={index}
    src={comment.author.image}
    alt={`user_${index}`}
    width={24}
    height={24}
    className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
  />
))} */}