"use client"

import { getChatLastMessage, getUserChats } from '@/lib/actions/Chat.actions';
import { IChat } from '@/lib/database/models/Chat.model';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ChatContext } from './Message/ChatContext';
import { usePathname } from 'next/navigation';
import { IMessage } from '@/lib/database/models/Message.model';

export const UserContext=createContext<any>(null);

export const UserProvider = ({children}:{children:ReactNode}) => {

    const {currUser,newChat}=useContext(ChatContext);
    const [allChats, setAllChats] = useState<IChat[]>([]);
    const [chatDeleted, setChatDeleted] = useState<boolean>(false);
    const [isBoard, setIsBoard] = useState(false);
    const [aMsg, setAMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPathname, setNewPathname] = useState(null);
    const [reLoad, setReLoad] = useState(false);
    const [lastMessage, setLastMessage] = useState<IMessage>();

    const pathname=usePathname();
    const isMessage=pathname.includes('message');

    useEffect(()=> {
      const newFunc=async()=>{
        if(reLoad || newChat) {
          try {
            const data=await getChatLastMessage(newChat._id,pathname);
            setLastMessage(data);
            setReLoad(false);
          } catch (error) {
            console.log(error);
          }
        }
      }
      newFunc();
    },[reLoad,newChat]);

    useEffect(()=> {
      if(pathname.includes('onBoard') || pathname.includes('sign-in') || pathname.includes('sign-up')) {
        setIsBoard(true);
      }
    },[pathname]);

    useEffect(()=> {
      if(isBoard && pathname==='/' ) {
        window.location.reload();
        setIsBoard(false);
      }
    },[isBoard,pathname]);

    useEffect(()=> {
      const newFunc=async()=> {
       try {
        setIsLoading(true);
        if(currUser || isMessage || chatDeleted || aMsg) {
          const allChats=await getUserChats(currUser?._id,pathname);
          if(allChats) setAllChats(allChats);
          setChatDeleted(false);
          setAMsg(false);
        }
       } catch (error) {
        console.log(error);
       }finally{
        setIsLoading(false);
       }
      }
      console.log('message');
      newFunc();
    },[currUser,isMessage,chatDeleted,aMsg]);

  return (
    <UserContext.Provider value={{
        allChats,
        setChatDeleted,
        setAMsg,
        isLoading,
        setNewPathname,
        newPathname,
        lastMessage,
        setReLoad
    }}
    >
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider 
