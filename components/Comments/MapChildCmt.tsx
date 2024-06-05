
import { IComment } from '@/lib/database/models/Comments.model'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useState } from 'react'
import CommentOptions from './CommentOptions'
import moment from 'moment'
import EditComment from './EditComment'

interface MapChildCmtProps {
    cmt:IComment,
    setChildCmts:Dispatch<SetStateAction<IComment[]>>,
    comment:IComment
}

const MapChildCmt = ({cmt,setChildCmts,comment}:MapChildCmtProps) => {
    const [editCmt, setEditCmt] = useState<IComment | null>(null);

    
  return (

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
            <div className=' flex w-full flex-col gap-1'>
                <div className=' flex-between w-full max-w-sm p-0'>
                    <div className=' flex flex-col gap-0'>
                        <p className=' font-[550] text-[15px]'>{cmt.commentor?.username}</p>
                        <p className=' text-sm text-[12px] text-gray-600'>{moment(cmt.createdAt).fromNow()}</p>
                    </div>
                    <CommentOptions
                        c={cmt}
                        setComments={setChildCmts}
                        setEditCmt={setEditCmt}
                        type='child'
                        comment={comment}
                    />
                </div>
                {editCmt===cmt ? (
                    <EditComment
                        editCmt={editCmt}
                        setEditCmt={setEditCmt}
                        setComments={setChildCmts}
                        type='child'
                    />
                ):(
                    <p className=' text-sm max-md:max-w-sm max-w-md text-clip overflow-hidden'>{cmt.text} </p>
                )}
            </div>
        </div>
    </div>
  )
}

export default MapChildCmt
