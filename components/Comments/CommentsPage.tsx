"use client"
import { IComment } from '@/lib/database/models/Comments.model';
import { IPost } from '@/lib/database/models/Post.model';
import React, { Dispatch, SetStateAction } from 'react';
import MapComments from './MapComments';

interface CommentsPageProps {
    comments:IComment[],
    setComments:Dispatch<SetStateAction<IComment[]>>,
    post:IPost,
    cmtReload:string,
    setCmtReload:Dispatch<SetStateAction<Boolean>>
}

const CommentsPage = ({comments,setComments,post,setCmtReload,cmtReload}:CommentsPageProps) => {

  return (
    <section className=' w-full flex md:pl-4 max-md:px-2 max-md:pr-4'>
        <div className=' flex flex-col gap-6 w-full'>
            {comments.length>0 && comments.map((c,i)=> (
                <MapComments 
                    key={i} 
                    c={c}
                    post={post}
                    setComments={setComments}
                    setCmtReload={setCmtReload}
                    cmtReload={cmtReload}
                />
            ))}
        </div>
    </section>
  )
}

export default CommentsPage;
