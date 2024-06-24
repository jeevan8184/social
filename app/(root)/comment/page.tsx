"use client"
import PostMapImages from '@/components/related/PostMapImages';
import Loader from '@/components/shared/Loader';
import { getPostWithId } from '@/lib/actions/Post.actions';
import { IPost } from '@/lib/database/models/Post.model';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useEffect, useState } from 'react'
import moment from 'moment';
import PostOptions from '@/components/related/PostOptions';
import { ChatContext } from '@/components/Message/ChatContext';
import { Textarea } from '@/components/ui/textarea';
import { emojis } from '@/consants';
import { Button } from '@/components/ui/button';
import { createComment } from '@/lib/actions/Comment.actions';
import { IComment } from '@/lib/database/models/Comments.model';
import CommentsPage from '@/components/Comments/CommentsPage';
import { ArrowLeftIcon } from 'lucide-react';

const CommentSection = () => {
    const searchParams=useSearchParams();
    const postId=searchParams.get('postId');
    const pathname=usePathname();
    const router=useRouter();

    const [post, setPost] = useState<IPost>();
    const {currUser}=useContext(ChatContext);
    const [text, setText] = useState<string>('');
    const [comments, setComments] = useState<IComment[]>([]);
    const [isPending, setIsPending] = useState(false);
    
    useEffect(()=> {
        const newFunc=async()=> {
            if(postId) {
                const post=await getPostWithId(postId,pathname);
                setPost(post);
                setComments(post?.comments);
            }
        }
        newFunc();
    },[postId]);

    const handleChange=async()=>{

        try {
            setIsPending(true);
            if(post && text.trim() !=='') {
                const newComment=await createComment({postId:post?._id,userId:currUser?._id,text,path:pathname});
                if(newComment) {
                    setComments((prev)=> [newComment,...prev]);
                }
            }
            setText('');
        } catch (error) {
            console.log(error);
        }finally{
            setIsPending(false);
        }
    }

    if(!post || !currUser) return <Loader />

  return (
       <section className=' m-0 p-0 overflow-hidden'>
        <div className=' px-2 max-sm:px-0.5 py-6 pb-36 flex flex-col gap-3'>
            <div className=' px-2 max-sm:px-0'>
                <button onClick={()=>router.back()}>
                    <ArrowLeftIcon />
                </button>
            </div>
            <div className=' flex flex-col'>
                <div className=' flex gap-2'>
                    <div className=' flex-between flex-col gap-1'>
                        <div className=''>
                            <div className=' relative h-14 w-14 rounded-full overflow-hidden'>
                                <Image
                                    src={post.creator.photo}
                                    alt='image'
                                    layout='fill'
                                    className=''
                                />
                            </div>
                        </div>
                        <div className=' h-full bg-grey-500 rounded-full w-0.5' />
                    </div>
                    <div className=' flex flex-col gap-2'>
                        <div className=' flex flex-col gap-0'>
                            <p className=' font-[550]'>{post.creator.username}</p>
                            <p className=' text-gray-500 text-sm'>{moment(post.createdAt).fromNow()}</p>
                        </div>
                        <p className=' font-[550] text-clip -ml-1 text-[15px] max-w-sm max-sm:w-[300px]'>{post.text}</p>
                        <div className=' -ml-2'>
                            <PostMapImages post={post} />
                        </div>
                        <div className=' -ml-8'>
                            <PostOptions post={post} />
                        </div>
                    </div>
                </div>
                <div className=' my-3 mx-6 flex gap-2'>
                    {emojis.map((e,i)=> (
                        <p 
                            className=' text-2xl cursor-pointer'
                            onClick={()=> setText((prev)=> prev+e.label)}
                        >
                            {e.label}
                        </p>
                    ))}
                </div>
                <div className=' flex gap-2 my-3 h-full'>
                    <div className=' flex-between flex-col gap-1'>
                        <div className=''>
                            <div className=' relative h-12 w-12 rounded-full overflow-hidden'>
                                <Image
                                    src={currUser?.photo}
                                    alt='image'
                                    layout='fill'
                                    className=''
                                />
                            </div>
                        </div>
                        <div className=' h-full bg-grey-500 rounded-full w-0.5' />
                    </div>
                    <div className=' flex flex-col gap-2 w-full'>
                        <div className=' flex flex-col gap-0'>
                            <p className=' font-[550]'>{currUser?.username}</p>
                            <p className=' text-sm text-gray-500 text-clip line-clamp-1'>{currUser?.bio}</p>
                        </div>
                        <Textarea 
                            placeholder={`Reply to ${post.creator.username}`} 
                            className=' placeholder:text-gray-600 rounded-xl mx-0 pl-6 min-h-10 bg-grey-50 dark:bg-dark-4 
                                border-none max-w-md max-h-16 no-scrollbar -ml-2' 
                            value={text}
                            onChange={(e)=> setText(e.target.value)}
                        />
                        {(text || isPending) && (
                            <div className=' flex max-w-md mt-1'>
                            <Button 
                                onClick={()=> {
                                    handleChange();
                                    setText('')
                                }}
                                disabled={!text}
                                className=' text-[13px] rounded-full text-white'
                            >
                                {isPending ? (
                                    <div className=' relative animate-spin'>
                                        <Image
                                            src='/assets/icons/loader.svg'
                                            alt='image'
                                            height={24}
                                            width={24}
                                            className=''
                                        />
                                    </div>
                                ):(
                                    <p className=''>Reply</p>
                                )}
                            </Button>
                        </div>
                        )}
                    </div>
                </div>
                <div className=' flex flex-1 flex-col gap-4'>
                    <h1 className=' font-semibold p-4 max-md:px-2'>Comments to Your post</h1>
                    <CommentsPage comments={comments} setComments={setComments} post={post} />
                
                </div>
            </div>
         </div>
       </section>
  )
}

const CommentSectionSuspense=()=>{
    return (
        <Suspense fallback={<Loader />}>
            <CommentSection />
        </Suspense>
    )
}

export default CommentSectionSuspense;


