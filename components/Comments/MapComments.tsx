import Image from 'next/image'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CommentOptions from './CommentOptions'
import EditComment from './EditComment'
import ReplyComment from './ReplyComment'
import moment from 'moment'
import { IComment } from '@/lib/database/models/Comments.model'
import { IPost } from '@/lib/database/models/Post.model'
import { getCmtWithChilds } from '@/lib/actions/Comment.actions'
import { usePathname } from 'next/navigation'
import MapChildCmt from './MapChildCmt'
import { ChevronDown } from 'lucide-react'

interface MapCommentsParams {
    c:IComment,
    setComments:Dispatch<SetStateAction<IComment[]>>,
    post:IPost,
    cmtReload:string,
    setCmtReload:Dispatch<SetStateAction<Boolean>>
}

const MapComments = ({c,setComments,post,setCmtReload,cmtReload}:MapCommentsParams) => {

    const pathname=usePathname();
    const [replyCmt, setReplyCmt] = useState<IComment | null>(null);
    const [editCmt, setEditCmt] = useState<IComment | null>(null);
    const [childCmts, setChildCmts] = useState<IComment[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isReply, setIsReply] = useState(false);

    const handleGet=async()=>{

        try {
            if(isReply) {
                setIsPending(true);
            }
            const comments=await getCmtWithChilds(c._id,pathname);
            if(comments) {
                setChildCmts(comments?.childrens);
            }
            if(isReply) {
                setShowReplies(true);
                setIsReply(false);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsPending(false);
        }
    }

    useEffect(()=> {
        if(c || cmtReload) {
            handleGet();
        }
    },[c,cmtReload]);

  return (
    <div className=' flex flex-1 flex-col gap-1'>
        <div className=''>
            <div className=' flex gap-1'>
                <div className=' flex-between flex-col gap-0.5'>
                    <div className=''>
                        <div className=' relative h-12 w-12 rounded-full border-grey-50 overflow-hidden'>
                            <Image
                                src={c.commentor?.photo}
                                alt='image'
                                layout='fill'
                                className=''
                            />
                        </div>
                    </div>
                    <div className=' h-full bg-grey-500 rounded-full w-0.5' />
                </div>
                <div className=' flex flex-col gap-2 w-full'>
                    <div className=' flex-between max-w-lg  w-full p-0'>
                        <div className=' flex flex-col gap-0'>
                            <div className=' flex gap-4'>
                                <p className=' font-[550] text-[15px]'>{c.commentor?.username}</p>
                                {showReplies && (
                                    <button 
                                        className=' font-normal size-4' 
                                        onClick={()=>setShowReplies(false) }
                                    >
                                        <ChevronDown />
                                    </button>
                                )}
                            </div>
                            <div className=' flex gap-3'>
                                <p className=' text-sm text-[14px] text-gray-600'>{moment(c.createdAt).fromNow()}</p>
                                <div className={`text-blue-600 text-sm cursor-pointer ${ showReplies ? ' hidden':''}`}
                                    onClick={()=> {
                                        setIsReply(true);
                                        handleGet();
                                    }}
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
                                        childCmts?.length >0 ? childCmts?.length>1 ?
                                            `${childCmts?.length} Replies` : `${childCmts?.length} Reply` :null
                                    )}
                                </div>
                            </div>
                        </div>
                        <CommentOptions 
                            c={c} 
                            post={post} 
                            setComments={setComments} 
                            setEditCmt={setEditCmt} 
                            setReplyCmt={setReplyCmt}
                        />
                    </div>
                    {editCmt===c ? (
                        <EditComment
                            editCmt={editCmt}
                            setEditCmt={setEditCmt}
                            setComments={setComments}
                        />
                    ):(
                        <p className=' text-sm max-md:max-w-sm max-w-md text-clip overflow-hidden'>{c.text} </p>
                    )}

                    {replyCmt && replyCmt._id===c._id && (
                        <ReplyComment 
                            replyCmt={replyCmt} 
                            setReplyCmt={setReplyCmt} 
                            setChildCmts={setChildCmts}
                            handleGet={handleGet}
                        />
                    )}

                    <div className=''>
                        {childCmts.length>0 && showReplies && (
                            <div className=' flex flex-col gap-2'>
                                <div className=' w-full h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full max-w-md mt-2' />
                                <div className=' flex flex-col gap-2'>
                                    {childCmts.map((child)=> (
                                        <MapChildCmt 
                                            key={child._id}
                                            cmt={child}
                                            setChildCmts={setChildCmts}
                                            comment={c}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                
            </div>
        </div>
    
    </div>
  )
}

export default MapComments
