import { IChat } from '@/lib/database/models/Chat.model';
import React, { useContext, useEffect, useState } from 'react'
import Chat from './Chat';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu" ;
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2, Trash2Icon } from 'lucide-react';
import { deleteChats } from '@/lib/actions/Chat.actions';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { UserContext } from '@/components/UserProvider';
import { ChatContext } from '../ChatContext';
import { INotify } from '@/lib/types';

interface AllChatsProps {
    allChats:IChat[]
}

const Allchats = ({allChats}:AllChatsProps) => {
    const {setChatDeleted}=useContext(UserContext);
    const {setNotifications}=useContext(ChatContext);

    const [isDelete, setIsDelete] = useState(false);
    const [delChats, setDelChats] = useState<IChat[]>([]);
    const pathname=usePathname();

    const handleDelete=async()=> {
        await deleteChats(delChats,pathname);
        setIsDelete(false);
        setChatDeleted(true);
        setDelChats([]);
    }

    useEffect(()=> {
        setNotifications((prevNotifies:INotify[])=> {
            const newNotifies=prevNotifies?.filter((notify)=> notify.isRead !=true);
            return newNotifies;
        })
    },[]);

  return (
    <div className=' flex flex-col gap-3 my-2 relative'>
        <div className=' flex-between'>
            <p className=' text-2xl font-semibold'>Users</p>
            <div className='relative flex gap-4 h-full items-center'>
                {isDelete && (
                <div className=' flex gap-4'>
                    <Button variant="none"
                        className='cancel' 
                        onClick={()=> {
                            setDelChats([]);
                            setIsDelete(false);
                        }}
                    >
                        Cancel
                    </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className=' flex-center'>
                                <Button variant="none" className=' text-white bg-red-500 rounded-full flex gap-2 '>
                                    <Trash2 className=' h-5 w-5 flex' />
                                    <span>Delete</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className=' bg-white dark:bg-dark-3 border border-gray-50'>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className=' font-semibold text-xl'>Are you sure you want to delete ?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className=' cancel border-none dark:hover:bg-gray-800'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className=' rounded-full border-none bg-red-500 text-white hover:bg-red-600'
                                        onClick={()=> handleDelete()}
                                    >
                                            Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger>
                    <div className=' active:border-none border-none focus-visible:ring-offset-0 flex gap-4'>
                        {/* <MoreVertical className=' font-normal  h-5 w-5' /> */}
                        <Image
                            src='/assets/icon/edit.svg'
                            className=''
                            height={24}
                            width={24}
                            alt='image'
                        />
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='down absolute top-0 right-0'>
                    <div className=' flex flex-col '>
                        <DropdownMenuItem className=' item'
                            onClick={()=> setIsDelete(true)}
                        >
                            <div className=' flex gap-2'>
                                <Trash2Icon className=' text-red-500 dark:text-white font-normal h-5 w-5' />
                                <p className=' text-red-500 dark:text-white'>Delete</p>
                            </div>
                        </DropdownMenuItem>
                    </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <div className=' flex relative flex-col w-full'>
            <div className=' flex flex-col gap-2'>
                {allChats.map((chat)=> (
                    <Chat chat={chat} isDelete={isDelete} delChats={delChats} setDelChats={setDelChats} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Allchats;
