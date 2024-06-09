"use client"
import { addReactionsMsg, createMessage, createMessagePost, deleteMessage, deleteMessages, deleteReactionsMsg } from '@/lib/actions/Message.actions';
import { getUser } from '@/lib/actions/User.actions';
import { IChat } from '@/lib/database/models/Chat.model';
import { IMessage } from '@/lib/database/models/Message.model';
import { IUser } from '@/lib/database/models/User.model';
import { INotify, IOnlineUsers } from '@/lib/types';
import { useUploadThing } from '@/lib/uploadthing';
import { usePathname } from 'next/navigation';
import React, { FC, ReactNode, createContext, useEffect, useState } from 'react'
import io from 'socket.io-client';
import { ClientUploadedFileData } from 'uploadthing/types';

export const ChatContext=createContext<any>(null);
const url=process.env.NEXT_PUBLIC_SOCKET
const socket=io(`${url}`);

console.log('url',url);

interface chatProviderProps {
    children:ReactNode
}

export const ChatProvider:FC<chatProviderProps> = ({children}) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newUser, setNewUser] = useState<IUser | null>(null);
    const [currUser, setCurrUser] = useState<IUser | null>(null);
    const [newChat, setNewChat] = useState<IChat | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [newMsg, setNewMsg] = useState<{text:string | null,image:File[]}>({text:null,image:[]});
    const [onlineUsers, setOnlineUsers] = useState<IOnlineUsers[]>([]);
    const [notifications, setNotifications] = useState<INotify[]>([]);
    const [deleteMultiple, setDeleteMultiple] = useState<IMessage[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [reactions, setReactions] = useState({msgId:null,emoji:null});
    const [postAndUsers, setpostAndUsers] = useState<{post:string | null,users:Array<string> | null}>({post:null,users:null});
    const [isPending, setIsPending] = useState(false);

    const pathname=usePathname();
    const {startUpload}=useUploadThing("imageUploader");

    useEffect(()=> {
        const newFunc=async()=> {
            const data=await getUser();
            setCurrUser(data);
        }
        newFunc();
    },[]);
 
    useEffect(()=> {
        if(currUser) {
            
            socket.emit('newUser',currUser?._id);
            socket.on('onlineUsers',(onlineUsers)=> {
                setOnlineUsers(onlineUsers);
            })
        }
            
        return ()=> {
            socket.off('newUser');
            socket.off('onlineUsers');
        }

    },[currUser,socket])

    useEffect(()=> {
        const newFunc=async()=> {
            if(newMsg.text || newMsg.image?.length>0) {
                
                try {
                    let imageurl=null;

                   if(newMsg.image?.length>0) {
                        const blob: ClientUploadedFileData<{ uploadedBy: string; }>[] | undefined =await startUpload(newMsg.image);
                        if( blob && blob?.length>0)  {
                            imageurl=blob[0]?.url;
                        }
                   }

                    const message=await createMessage({
                        text:newMsg.text,
                        senderId:currUser?._id!,
                        receiverId:newUser?._id!,
                        path:pathname,
                        image:imageurl
                    });
                    socket.emit('newMsg',{
                        newMsg:message,
                        senderId:currUser?._id,
                        receiverId:newUser?._id,
                        name:currUser?.username
                    })
                    setNewMsg({text:null,image:[]});
                } catch (error) {
                    console.log(error);
                }
            }
        }
        newFunc();
    },[socket,newMsg]);

    useEffect(()=>{
        const newFunc=async()=>{
            if(postAndUsers?.post && postAndUsers?.users) {

                console.log('postAndUsers',postAndUsers);
                try {
                    setIsPending(true);
                    await Promise.all(
                        postAndUsers?.users.map(async(receiverId)=>{
                            const message=await createMessagePost({
                                senderId:currUser?._id!,
                                receiverId,
                                path:pathname,
                                post:postAndUsers.post
                            });
                            socket.emit('newMsg',{
                                newMsg:message,
                                senderId:currUser?._id,
                                receiverId:receiverId,
                                name:currUser?.username
                            })
                        })
                    )
                    setpostAndUsers({post:null,users:null});
                } catch (error) {
                    console.log(error);
                }finally{
                    setIsPending(false);
                }
            }
        }
        newFunc();
    },[postAndUsers]);

    useEffect(()=> {
        const newFunc=async()=> {
            if(isDelete) {
                await deleteMessages(deleteMultiple);
                
                socket.emit('deleteMultiple',({msgs:deleteMultiple,senderId:currUser?._id,receiverId:newUser?._id}));
                setDeleteMultiple([]);
                setIsDelete(false);
            }
        }
        newFunc(); 

    },[isDelete]);

    useEffect(()=> {
        const newFunc=async()=> {
            if(reactions.msgId) {
                const msg=messages.find((m)=> m._id===reactions.msgId);
                const isRxn=msg?.reactions?.find((r)=> r.userId===currUser?._id && r.emoji===reactions?.emoji);
                
                if(isRxn) {
                    const rxnMsg=await deleteReactionsMsg({userId:currUser?._id!,emoji:reactions?.emoji!,id:reactions.msgId});
                    socket.emit('setEmoji',{msg:rxnMsg,senderId:currUser?._id,receiverId:newUser?._id});
                }else {
                    const rxnMsg=await addReactionsMsg({userId:currUser?._id!,emoji:reactions?.emoji!,id:reactions.msgId});
                    socket.emit('setEmoji',{msg:rxnMsg,senderId:currUser?._id,receiverId:newUser?._id});
                }
                setReactions({msgId:null,emoji:null});
            }
        }
        newFunc();
    },[reactions])

    useEffect(()=> {
        if(isTyping) {
            socket.emit('startTyping',({senderId:currUser?._id,receiverId:newUser?._id}));
        }else {
            socket.emit('stopTyping',({senderId:currUser?._id,receiverId:newUser?._id}));
        }
    },[isTyping]);

    useEffect(()=> {
        const newFunc=async()=> {
            if(deleteId) {
                await deleteMessage(deleteId);

                socket.emit('deleteMsg',({ deleteId,senderId:currUser?._id,receiverId:newUser?._id}));
                setDeleteId(null); 
            }
        }
        newFunc();
    },[deleteId]);

    useEffect(()=> {

        socket.on('receiveMsg',(msg)=> {
            setMessages((prev)=> [...prev,msg]);
        })
        socket.on('onlineUsers',(onlineUsers)=> {
            setOnlineUsers(onlineUsers);
        })
        socket.on('notify',(n)=> {
            setNotifications((prev)=> [...prev,n]);
        })
        socket.on('delmsgs',(msgs)=> {
            setMessages((prev)=> {
                const newMsgs=prev.filter((p)=> !msgs.some((m:IMessage)=> m._id===p._id));
                return newMsgs;
            })
        })
        socket.on('emoji',(msg)=> {
            setMessages((prev)=> {
                const newMsgs=prev.map((p)=> p._id===msg._id ? {...msg} :p);
                return newMsgs;
            })
        })
        socket.on('delete',(id)=> {
            setMessages((prev)=> prev.filter((p)=> p._id !==id));
        })

        return ()=> {
            socket.off('receiveMsg');
            socket.off('onlineUsers');
            socket.off('delmsgs');
            socket.off('delete');
            socket.off('notify');
        }
    },[socket]);


  return (
    <ChatContext.Provider value={{
        messages,
        setMessages,
        newUser,
        setNewUser,
        currUser,
        setCurrUser, 
        newChat, 
        setNewChat,
        setIsTyping,
        setNewMsg,
        onlineUsers,
        setIsDelete,
        isDelete,
        deleteMultiple,
        setDeleteMultiple,
        setDeleteId,
        setReactions,
        setpostAndUsers,
        isPending,
        notifications,
        setNotifications
    }}
    >
        {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider;

