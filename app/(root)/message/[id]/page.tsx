
"use client"
import { ChatContext } from '@/components/Message/ChatContext';
import ChatMessage from '@/components/Message/ChatMessage'
import { getChatMessages, getChatWithId } from '@/lib/actions/Chat.actions';
import { getUser } from '@/lib/actions/User.actions';
import { IUser } from '@/lib/database/models/User.model';
import { INotify } from '@/lib/types';
import React, { useContext, useEffect } from 'react'

const MessageUser = ({params:{id}}:{params:{id:string}}) => {
  
  const {setMessages,setNewUser,setNewChat,newChat,currUser,setNotifications}=useContext(ChatContext);

  useEffect(() => {
      const getAuthData = async () => {
        const user=await getUser();
        const chat=await getChatWithId({chatId:id,sender:user._id});

        const chatMsgs=await getChatMessages(id);
        const chatUser=chat?.participants.filter((u:IUser)=>u._id !==user._id);

        setMessages(chatMsgs?.messages);
        if(chatUser) {
          setNewUser(chatUser[0]);
        }
        setNewChat(chat);
      };
      getAuthData();
  }, [id]);

  useEffect(()=> {
    if(newChat) {
      const user=newChat?.participants?.find((p:IUser)=> p._id !==currUser?._id);
      setNotifications((notifications:INotify[])=> {
        const newNotifies=notifications.filter((notify:INotify)=> notify.senderId !== user._id);
        return newNotifies;
      });
    }
  },[newChat]);

  return (
    <div className=' z-0 flex flex-1 flex-col '>
        <ChatMessage />
    </div>
  )
}

export default MessageUser;

