
import React, { useContext, useState } from 'react'
import { ChatContext } from './ChatContext'
import Loader from '../shared/Loader'
import ChatTopbar from './ChatTopbar'
import MapMessages from './MapMessages'
import InputMsg from './InputMsg'

const ChatMessage = () => {

  const {messages,newUser,currUser}=useContext(ChatContext);
  const [isDelTrue, setIsDelTrue] = useState(false);

  if(!messages || !newUser || !currUser) return <Loader />

  return (
    <div className=' flex flex-col h-full w-full'>
        <div className=' flex flex-col flex-between'>
            <ChatTopbar setIsDelTrue={setIsDelTrue} isDelTrue={isDelTrue} />
            <MapMessages isDelTrue={isDelTrue}  />
        </div>
        <InputMsg />
    </div>
  )
}

export default ChatMessage
