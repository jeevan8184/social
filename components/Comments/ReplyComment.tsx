import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Input } from '../ui/input'
import { IComment } from '@/lib/database/models/Comments.model'
import Image from 'next/image';
import { SendHorizonalIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { emojis } from '@/consants';
import { ChatContext } from '../Message/ChatContext';
import { ReplyToComment } from '@/lib/actions/Comment.actions';

interface ReplyCommentProps {
    replyCmt:IComment,
    setReplyCmt:Dispatch<SetStateAction<IComment | null>>,
    setChildCmts:Dispatch<SetStateAction<IComment[]>>,
    handleGet:()=>void;
}


const ReplyComment = ({replyCmt,setReplyCmt,setChildCmts,handleGet}:ReplyCommentProps) => {

    const [text, setText] = useState('');
    const pathname=usePathname();
    const [isPending, setIsPending] = useState(false);
    const {currUser}=useContext(ChatContext);

    const handleReply=async()=>{

        try {
            setIsPending(true);
            if(text.trim() !=='') {
                const newCmt=await ReplyToComment({text,userId:currUser?._id,path:pathname,commentId:replyCmt._id});
                setChildCmts((prev)=> [newCmt,...prev]);
            }
            handleGet();
            setReplyCmt(null);
        } catch (error) {
            console.log(error);
        }finally{
            setIsPending(false);
        }
    }

  return (
        <div className=' max-w-md mx-0 flex flex-col'>
            <div className=' flex-between gap-1'>
                <Input
                    type='text'
                    className=' border rounded-2xl bg-gray-100 placeholder:text-gray-500 py-0 dark:bg-dark-4 border-white'
                    value={text}
                    onChange={(e)=> setText(e.target.value)}
                    placeholder={`Reply to ${replyCmt.commentor.username}`}
                />
                <button 
                    className=' px-4 py-2 bg-blue-500/20 text-blue-500 rounded-full'
                    disabled={isPending}
                    onClick={()=> handleReply()}
                >
                    {isPending ? (
                        <div className=' relative animate-spin'>
                            <Image
                                src='/assets/icons/loader.svg'
                                alt='image'
                                className=''
                                height={24}
                                width={24}
                            />
                        </div>
                    ):(
                        <SendHorizonalIcon className=' size-5' />
                    )}
                </button>
            </div>
                <div className=' my-1 flex gap-2'>
                    {emojis.map((e,i)=> (
                        <p 
                            className=' text-xl cursor-pointer'
                            onClick={()=> setText((prev)=> prev+e.label)}
                        >
                            {e.label}
                        </p>
                    ))}
                </div>
        </div>
    )
}

export default ReplyComment