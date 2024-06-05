import React, { useContext } from 'react'
import { ChatContext } from './ChatContext'
import {
    DropdownMenu,
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu" 
import { ChevronDown, Trash } from 'lucide-react';
import { emojis1 } from '@/consants';
import { IMessage } from '@/lib/database/models/Message.model';


const DropdownPage = ({msg}:{msg:IMessage}) => {

    const {setDeleteId,setReactions}=useContext(ChatContext);
    
  return (
        <DropdownMenu>
            <DropdownMenuTrigger>
              <div className=' focus-visible:aspect-square border-none focus-visible:ring-offset-0 overflow-hidden'>
                <ChevronDown className=' font-normal  h-5 w-5' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=' down top-0 left-0 overflow-hidden'>
              <div className=' flex gap-1 '>
                <DropdownMenuItem className=' left-0 item'
                    onClick={()=> setDeleteId(msg._id)}>
                  <Trash className=' font-normal h-5 w-5' />
                </DropdownMenuItem>
                <div className=' flex gap-0'>
                  {emojis1.map((e,i)=> (
                    <DropdownMenuItem onClick={()=>setReactions({msgId:msg._id,emoji:e.label}) } className=' text-wrap item text-2xl'>
                      {e.label}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
        </DropdownMenu>
  )
}

export default DropdownPage;
