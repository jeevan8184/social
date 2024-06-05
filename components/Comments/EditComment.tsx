import Image from 'next/image'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { emojis } from '@/consants'
import { SendHorizonalIcon } from 'lucide-react'
import { updateComment } from '@/lib/actions/Comment.actions'
import { usePathname } from 'next/navigation'
import { IComment } from '@/lib/database/models/Comments.model'

interface EditCommentProps {
    editCmt:IComment,
    setEditCmt:Dispatch<SetStateAction<IComment | null>>;
    setComments:Dispatch<SetStateAction<IComment[]>>;
    type?:'child'
}

const EditComment = ({editCmt,setEditCmt,setComments,type}:EditCommentProps) => {

    const pathname=usePathname();
    const [text, setText] = useState('');
    const [isPending, setIsPending] = useState(false);

    useEffect(()=> {
        if(editCmt) {
            setText(editCmt.text);
        }
    },[editCmt]);

    const handleChange=async()=>{

        try {
            setIsPending(true);
            
            if(text.trim() !=='') {
                const cmt=await updateComment({id:editCmt?._id,text,path:pathname});
                console.log('updatedComment',cmt);
                if(cmt) {
                    setComments((comments)=> {
                        const newComments=comments?.map((c)=> c._id===cmt?._id ? {...cmt} : c);
                        return newComments;
                    })
                }
                setText('');
                setEditCmt(null);
            }
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsPending(false);
        }
    }


  return (
    <div className={`${type==='child' ? ' max-w-sm':' max-w-md'} mx-0 `}>
        <div className='flex-between gap-1'>
            <Input
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className=' border border-white bg-gray-100 rounded-2xl dark:bg-dark-4'
            />
            <button 
                className=' px-4 py-2 bg-blue-500/20 text-blue-500 rounded-full'
                disabled={isPending}
                onClick={()=> handleChange()}
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

export default EditComment