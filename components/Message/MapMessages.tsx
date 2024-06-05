import React, { useContext, useEffect, useRef, useState } from 'react'
import { ChatContext } from './ChatContext'
import { IMessage } from '@/lib/database/models/Message.model';
import { formatDateTimeOpt } from '@/lib/utils';
import DropdownPage from './DropdownPage';
import Image from 'next/image';
import ShowImg from '../related/ShowImg';
import PostMapImages from '../related/PostMapImages';

const MapMessages = ({isDelTrue}:{isDelTrue:boolean}) => {

    const {messages,currUser,deleteMultiple,setDeleteMultiple}=useContext(ChatContext);

    const [isActive, setIsActive] = useState(false);
    const [openMsgId, setOpenMsgId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const scroll=useRef<HTMLDivElement>();
     
    useEffect(()=> {
      scroll.current?.scrollIntoView({behaviour:'smooth'});
    },[messages]);

    const handleChange=(msg:IMessage)=> {
      if(!deleteMultiple.includes(msg)) {
        setDeleteMultiple((prev: any)=> [...prev,msg]);
      }else{
        setDeleteMultiple((prev:any)=> {
          return prev.filter((p:IMessage)=> p !==msg)
        })
      }
    }

    const countEmojis=(reactions:IMessage["reactions"])=> {
      return reactions?.reduce((acc:{[key:string]:number},reaction)=> {
        const {emoji}=reaction;
        if(!acc[emoji]) {
          acc[emoji]=0;
        }
        acc[emoji]++;
        return acc;
      },{})
    }

    const handleImage=()=> {
      setSelectedImg(null);
      setOpen(false);
    }

  return (
        <div className=' w-full h-full pb-12 scroll-smooth' >
          <div className=' h-full '>
            {messages.length>0 ? (
              <div className=' py-2 pb-8 px-1 gap-2 '>
                {messages.map((msg:IMessage)=> {
                  const countedEmojis=countEmojis(msg?.reactions);
                  return (
                    <div className=' gap-0 mb-1 z-0'>
                      <div className=' group'>
                        <div  className={`${msg?.sender===currUser._id ? ' justify-end ':' justify-start '} 
                            ${isDelTrue && ' cursor-pointer'} flex items-center`} key={msg._id}
                        >
                          <div className={`${msg?.sender !==currUser._id ? 'hidden':''} ${openMsgId !==msg._id && 'hidden'} mr-2`}>
                            <DropdownPage msg={msg} />
                          </div>
                          <div className={` ${deleteMultiple?.includes(msg) && ' text-red-400 '}`}
                            onClick={()=> isDelTrue ? handleChange(msg) : setOpenMsgId(msg._id) }
                          >
                              <div className=' msg flex flex-col'>
                                {msg?.post && (
                                  <div className=' flex gap-1'>
                                    <div className=' flex-between gap-1 flex-col'>
                                      <div className=''>
                                        <div className=' relative h-8 w-8 rounded-full overflow-hidden'>
                                            <Image
                                              src={msg?.post.creator?.photo}
                                              alt='image'
                                              layout='fill'
                                            />
                                        </div>
                                       </div>
                                       <div className=' w-0.5 h-full bg-gray-500 rounded-full' />
                                    </div>
                                    <div className=' flex flex-col gap-1'>
                                        <p className=' font-[550]'>{msg?.post?.creator.username}</p>
                                        <p className=' text-sm text-clip overflow-hidden max-w-60 line-clamp-2'>{msg?.post.text}</p>
                                        {msg?.post?.images.length>0 && (
                                          <PostMapImages post={msg?.post} type='msg' />
                                        )}
                                    </div>
                                  </div>
                                )}
                                {msg?.image && (
                                  <div className=' w-fit'>
                                    <div className={`${deleteMultiple?.includes(msg) ? ' bg-red-500' :'bg-white/100'} photo px-2 py-2`}>
                                      <div className=' w-fit'>
                                        <Image
                                          src={msg?.image} 
                                          alt='image'
                                          layout='fill'
                                          className=' rounded-xl overflow-hidden'
                                          onClick={()=> {
                                            setSelectedImg(msg?.image);
                                            setOpen(true);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className=' flex flex-col'>
                                  <p className=''>{msg.text} </p>
                                  <p className=' text-[12px]'>{formatDateTimeOpt(msg.createdAt).timeOnly}</p>
                                </div>
                              </div>
                              <div className=' ml-2 flex gap-0'>
                                 {countedEmojis &&  Object?.entries(countedEmojis).map(([emoji,cnt])=> (
                                  <div className=' flex gap-0'>
                                    <p className=''>{emoji}</p>
                                    <p className=' text-sm'></p>
                                  </div>
                                 ))}
                              </div>
                          </div>
                
                          <div className={` relative ${msg?.sender ===currUser._id ? 'hidden':''} ${openMsgId !==msg._id && 'hidden'}`}>
                            <DropdownPage msg={msg} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ):(
              <div className=' flex-center min-h-screen'>
                <p 
                  className={` hi ${isActive && 'hidden'}`}
                  onClick={()=> {
                    setIsActive(true)
                  }}
                >
                  Say 'Hi' 
                </p>
              </div>
            )}
          </div>
          <div ref={scroll} />
        </div>
  )
}

export default MapMessages


// {selectedImg && (
//   <ShowImg open={open} img={selectedImg} handleImage={handleImage} />
// )}