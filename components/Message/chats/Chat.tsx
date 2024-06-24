import { IChat } from '@/lib/database/models/Chat.model'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../ChatContext'
import { getChatLastMessage } from '@/lib/actions/Chat.actions'
import { IMessage } from '@/lib/database/models/Message.model'
import { Check, CheckIcon, ChevronDown } from 'lucide-react'
import { INotify, IOnlineUsers } from '@/lib/types'
import { UserContext } from '@/components/UserProvider'

interface ChatProps {
    chat:IChat,
    isDelete:boolean,
    delChats:IChat[],
    setDelChats:Dispatch<SetStateAction<IChat[]>>
}

const Chat = ({chat,isDelete,delChats,setDelChats}:ChatProps) => {
    const router=useRouter();
    const pathname=usePathname();
    const {currUser,notifications,onlineUsers}=useContext(ChatContext);
    const {reLoad}=useContext(UserContext);
    const [lastMsg, setLastMsg] = useState<IMessage>();

    const isMessage=pathname.includes('message');

    console.log('reload',reLoad);

    const user=chat?.participants?.find((p)=> p._id !==currUser?._id);

    useEffect(()=> {
        const newFunc=async()=> {
            if(chat || (chat && isMessage) || reLoad) {
                try {
                    const lastMsg=await getChatLastMessage(chat?._id,pathname);
                    setLastMsg(lastMsg);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        const LastMsgFn=setTimeout(()=> {
            newFunc();
        },200);
        
        return ()=> clearTimeout(LastMsgFn);
    },[chat,isMessage,reLoad]);

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

    const chatNotifies=notifications.filter((notify:INotify)=> notify.senderId===user._id);
    const isOnline=onlineUsers.some((newUser:IOnlineUsers)=> newUser.userId===user._id);
    const isTyping=onlineUsers.some((newUser:IOnlineUsers)=>newUser.userId===user._id && newUser.isTyping);

    let y= chatNotifies[chatNotifies.length-1]?.newMsg 

  return (
    <div>
        <div className=' bg-slate-100 dark:bg-dark-4 px-4 py-1 rounded-2xl group relative' 
            onClick={()=> {
                isDelete ?  handleAdd() : router.push(`/message/${chat._id}`); 
            } }
        >
            <div className=' w-full flex-between cursor-pointer'>
                <div className=' flex gap-4'>
                    <div className=' relative'>
                        <div className=' rounded-full relative h-12 w-12 '>
                            <Image
                                src={user?.photo}
                                alt='image'
                                layout='fill' 
                                className=' rounded-full'
                            />
                        </div>
                       {isOnline && (
                        <div className=' absolute bottom-0 right-0'>
                            <div className=' size-3 bg-green-500 rounded-full' />
                        </div>
                       )}
                    </div>
                    <div className=' flex flex-col'>
                        <p className=' font-semibold '>{user.username}</p>
                        {isTyping ? (
                            <p className=' text-blue-500 text-[15px]'>Typing...</p>
                        ):(
                            <p className=' dark:text-gray-400 text-sm font-normal'>
                                {
                                    chatNotifies.length>0 ? y?.image ? 'img': y?.post ? 'post': y?.text : 
                                    lastMsg?.image ? 'img': lastMsg?.post ? 'post': lastMsg?.text
                                }
                            </p>
                        )}
                    </div>
                </div>
                <div className=''>
                    {delChats?.includes(chat) ? (
                        <p className=' text-green-500 p-1'>
                            <CheckIcon className=' size-7 rounded-full bg-white dark:bg-dark-2 text-2xl'/>
                        </p>
                    ):(
                        <div className=' '>
                            {chatNotifies.length>0 && !isDelete && (
                                <div className=' text-black font-semibold bg-green-500 text-[15px] rounded-full px-1.5 text-sm'>{chatNotifies.length}</div>
                            )}
                        </div>
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

