
import React from 'react'
import Postcard from '../related/Postcard'
import { IComment } from '@/lib/database/models/Comments.model'
import { IPost } from '@/lib/database/models/Post.model'
import Image from 'next/image'
import moment from 'moment'

interface RepliesPageProps {
    replies:Array<{comments:IComment[],postId:IPost}>
}

const RepliesPage = ({replies}:RepliesPageProps) => {

  return (
    <div className=''>
        <div className=''>
            {replies?.length>0 ? (
                    <div className=' flex flex-col gap-4'>
                        {replies.map((reply,i)=> (
                            <div className=' flex flex-col gap-2' key={i} >
                                <Postcard post={reply.postId} />
                                <div className=' flex flex-col gap-1 px-6'>
                                    {reply?.comments.map((cmt)=> (
                                        <div className=' pl-6' key={cmt._id}>
                                            <div className=''>
                                                <div className=' flex gap-1'>
                                                    <div className=' flex-between flex-col gap-0.5'>
                                                        <div className=''>
                                                            <div className=' relative h-12 w-12 rounded-full border-grey-50 overflow-hidden'>
                                                                <Image
                                                                    src={cmt.commentor?.photo}
                                                                    alt='image'
                                                                    layout='fill'
                                                                    className=''
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className=' h-full bg-grey-500 rounded-full w-0.5' />
                                                    </div>
                                                    <div className=''>
                                                        <p className=''>{cmt.commentor.username}</p>
                                                        <p className=' text-sm text-[14px] text-gray-600'>{moment(cmt.createdAt).fromNow()}</p>
                                                        <p className=''>{cmt.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <h1 className=' flex-center mt-10 text-xl font-semibold'>
                        No Replies found
                    </h1>
                )
            }
        </div>
    </div>
  )
}

export default RepliesPage
