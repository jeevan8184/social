import { IChat } from '@/lib/database/models/Chat.model'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../ChatContext'
import { getChatLastMessage } from '@/lib/actions/Chat.actions'
import { IMessage } from '@/lib/database/models/Message.model'
import { Check, CheckIcon, ChevronDown } from 'lucide-react'
import { INotify } from '@/lib/types'

interface ChatProps {
    chat:IChat,
    isDelete:boolean,
    delChats:IChat[],
    setDelChats:Dispatch<SetStateAction<IChat[]>>
}

const Chat = ({chat,isDelete,delChats,setDelChats}:ChatProps) => {
    const router=useRouter();
    const {currUser,notifications}=useContext(ChatContext);
    const [lastMsg, setLastMsg] = useState<IMessage>();

    const user=chat.participants?.find((p)=> p._id !==currUser?._id);

    useEffect(()=> {
        
    },[]);

    useEffect(()=> {
        const newFunc=async()=> {
            const lastMsg=await getChatLastMessage(chat?._id);
            setLastMsg(lastMsg);
        }
        newFunc();
    },[chat]);

    if(!user) return;

    const handleAdd=()=> {
        setDelChats((prev:IChat[])=> {
            const isChat=prev.find((c)=> c===chat);
            if(isChat) {
               return prev.filter((c)=> c !==chat);
            }else {
                return [...prev,chat];
            }
        })
    }

    const chatNotifies=notifications.filter((notify:INotify)=> notify.receiverId===user._id);

  return (
    <div>
        <div className=' bg-slate-100 dark:bg-dark-4 px-4 py-1 rounded-2xl group relative' 
            onClick={()=> {
                isDelete ?  handleAdd() : router.push(`/message/${chat._id}`); 
            } }
        >
            <div className=' w-full flex-between cursor-pointer'>
                <div className=' flex gap-4'>
                    <div className=' rounded-full relative h-12 w-12 '>
                        <Image
                            src={user?.photo}
                            alt='image'
                            layout='fill' 
                            className=' rounded-full'
                        />
                    </div>
                    <div className=' flex flex-col'>
                        <p className=' font-semibold '>{user.username}</p>
                        <p className=' text-gray-700 text-sm font-serif'>{lastMsg?.text}</p>
                    </div>
                </div>
                <div className=''>
                    {delChats?.includes(chat) && (
                        <p className=' text-green-500 p-1'>
                            <CheckIcon className=' size-7 rounded-full bg-white dark:bg-dark-2 text-2xl'/>
                        </p>
                    )}
                </div>
            </div>
            <div className=' absolute top-0 right-0 hidden group-hover:flex'>
                {/* <ChevronDown /> */}
            </div>
        </div>
    </div>
  )
}

export default Chat

