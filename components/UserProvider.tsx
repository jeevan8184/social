"use client"

import { getUserChats } from '@/lib/actions/Chat.actions';
import { IChat } from '@/lib/database/models/Chat.model';
import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from './Message/ChatContext';
import { usePathname } from 'next/navigation';

export const UserContext=createContext<any>(null);
 
export const UserProvider = ({children}:{children:ReactNode}) => {

    const {currUser}=useContext(ChatContext);
    const [allChats, setAllChats] = useState<IChat[]>([]);
    const [chatDeleted, setChatDeleted] = useState<boolean>(false);

    const pathname=usePathname();
    const isMessage=pathname.includes('message');

    useEffect(()=> {
      const newFunc=async()=> {
        if(currUser || isMessage || chatDeleted) {
          const allChats=await getUserChats(currUser?._id,pathname);
          if(allChats) setAllChats(allChats);
          setChatDeleted(false);
        }
      }
      newFunc();
    },[currUser,isMessage,chatDeleted]);


  return (
    <UserContext.Provider value={{
        allChats,
        setChatDeleted
    }}
    >
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider 
