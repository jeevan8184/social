import { ArrowLeft, Check, EllipsisVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { ChatContext } from './ChatContext';
import Image from 'next/image';
import { IOnlineUsers } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { toast } from '../ui/use-toast';
import { UserContext } from '../UserProvider';

interface ChatTopbarProps {
    setIsDelTrue:Dispatch<SetStateAction<boolean>>,
    isDelTrue:boolean
}
  
const ChatTopbar = ({setIsDelTrue,isDelTrue}:ChatTopbarProps) => { 

    const router=useRouter();
    const {newUser,onlineUsers,setIsDelete}=useContext(ChatContext);
    const {setReLoad}=useContext(UserContext);

    const online=onlineUsers.some((u:IOnlineUsers)=> u.userId===newUser?._id);
    const typing=onlineUsers.some((u:IOnlineUsers)=> u.userId===newUser?._id && u.isTyping);


  return (
    <div className=' sticky top-0 shadow-sm py-1 px-4 w-full h-fit z-50 overflow-hidden bg-white dark:bg-dark-1 dark:shadow-xl'>
        <div className=' flex justify-between items-center'>
            <div className=' flex gap-4 items-center'>
                <button
                    className=''
                    onClick={(e)=> {
                    e.stopPropagation();
                    router.push('/message');
                    } }
                >
                    <ArrowLeft />
                </button>
                <div className=' relative rounded-full h-12 w-12'>
                    <Image
                    src={newUser.photo}
                    alt='image'
                    layout='fill'
                    className=' rounded-full'
                    />
                </div>
                <div className='flex flex-col gap-0'>
                    <p className=''>{newUser.username}</p>
                    <p className=' text-sm text-blue-500'>{typing ? 'typing...':online && 'online' }</p>
                </div>
            </div>
            <div className=' relative flex flex-row gap-4 items-center'>
                {isDelTrue && (
                    <button className=''
                        onClick={()=> {
                            setIsDelete(true);
                            setIsDelTrue(false);
                            setReLoad(true);
                        }}
                    >
                        <Check className=' h-5 w-5' />
                    </button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger className=' border-none focus-visible:ring-0 focus-visible:ring-offset-0'>
                        <EllipsisVertical className=' h-5 w-5 border-none' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=' border border-gray-600 w-48 dropdown flex flex-col gap-0 down'>
                        <DropdownMenuItem 
                            className='hover:bg-grey-50 w-full flex gap-2 rounded-md cursor-pointer item'
                            onClick={()=> {
                                toast({
                                    description:'click msg to delete'
                                })
                                setIsDelTrue((prev)=> !prev);
                            }}
                        >
                            <Trash2 className=' mr-2 h-4 w-4' />
                            <span>Delete</span>
                        </DropdownMenuItem>    
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </div>
  )
}

export default ChatTopbar;
