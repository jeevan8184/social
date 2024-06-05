
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
    <div className=' flex justify-between flex-col w-full '>
        <div className=' flex flex-col'>
           <ChatTopbar setIsDelTrue={setIsDelTrue} isDelTrue={isDelTrue} />
            <MapMessages isDelTrue={isDelTrue}  />
        </div>
        <div className=''>
          <InputMsg />
        </div>
    </div>
  )
}

export default ChatMessage
