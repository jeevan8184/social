"use client"
import { IUser } from '@/lib/database/models/User.model'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { addFriend } from '@/lib/actions/User.actions'
import { createChat } from '@/lib/actions/Chat.actions'
import ShowImg from '../related/ShowImg'
import { ChatContext } from '../Message/ChatContext'
import ProfileShares from './ProfileShares'

interface profileParams {
    user:IUser,
    type?:'user'
}

const ProfilePage = ({user,type}:profileParams) => {
  const router=useRouter();
  const [isFriend, setIsFriend] = useState<boolean>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const {currUser,setCurrUser}=useContext(ChatContext);
  const [isLoading, setIsLoading] = useState(false);

  const pathname=usePathname();

  useEffect(()=> {
    if(type==='user') {
      const x=currUser?.friends?.some((newUser:IUser)=> newUser._id===user._id);
      if(x) setIsFriend(true);
    }
    
  },[user,type])

  const handleChange=async()=> {

    try {
      setIsPending(true);
      const existUser=await addFriend({userId:user._id,path:pathname})
      if(existUser) {
        setCurrUser(existUser);
        setIsFriend((prev)=> !prev);
      }

    } catch (error) {
      console.log(error);
    }finally{
      setIsPending(false);
    }
  }

  const handleMessage=async()=> {

    try {
      setIsLoading(true);
      const createdChat=await createChat({senderId:currUser?._id,receiverId:user._id});
      if(createdChat) router.push(`/message/${createdChat._id}`);

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  const handleImage=()=>{
    setIsOpen(false);
    setSelectedImg(null);
  }

  return (

    <div className=' w-full pr-1'>
        <div className=' flex flex-col gap-4 lg:gap-8 w-full'>
          <div className=' flex flex-col gap-4  '>
            <div className=' flex gap-3 lg:gap-16 px-3'>
              <div className=''>
                <div className=' mx-auto relative cursor-pointer h-48 w-48 max-md:h-36 max-md:w-36 shadow-md
                    rounded-full object-contain object-center overflow-hidden  p-1'>
                    <Image
                      src={user.photo}
                      layout='fill'
                      alt='image'
                      className=''
                      onClick={()=>{
                        setSelectedImg(user.photo);
                        setIsOpen(true);
                      }}
                    />
                </div>
              </div>
              <div className=' my-4 flex flex-1 flex-col gap-6 max-sm:gap-4'>
                 <div className=' flex flex-col gap-2'>
                    <div className=' flex w-full gap-12 max-md:gap-6'>
                        <div className=' flex flex-col gap-1 items-center cursor-pointer'>
                          <label className=' bg-grey-50 dark:bg-gradient-to-b dark:bg-transparent px-4 py-1.5 rounded-xl font-semibold'>Followers</label>
                          <span className=' font-bold'>100k</span>
                        </div>
                        <div className=' flex flex-col gap-1 items-center cursor-pointer'>
                          <label className='bg-grey-50 dark:bg-transparent dark:bg-gradient-to-b px-4 py-1.5 rounded-xl font-semibold'>Friends</label>
                          <span className=' font-bold'>100</span>
                        </div>
                    </div>
                 </div>
                 <div className=''>
                    {type==='user' && (
                      <div className={`flex ${isFriend ? 'gap-3':'gap-6'}`}>
                        <Button
                          className=' rounded-full px-6 text-white'
                          onClick={()=> {
                            handleMessage();
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'wait...' : 'message'}
                        </Button>
                        <Button
                          className=' rounded-full px-6 text-white'
                          disabled={isPending}
                          onClick={handleChange}
                        >
                          {isPending ? 'processing' : isFriend ? 'unfriend':'friend'}
                        </Button>
                    </div>
                    )}
                  </div>
              </div>
            </div>
            <div className=' flex flex-col px-3'>
              {!type && (
                <Button 
                  className=' w-fit rounded-xl flex gap-2 bg-blue-500/10 text-[#877EFF] hover:bg-blue-500/20' 
                  variant={undefined}
                  onClick={()=> {
                    router.push(`/onBoard/${user._id}`)
                  }}
                >
                  <Image
                      src='/assets/icon/edit.svg'
                      className=''
                      height={24}
                      width={24}
                      alt='image'
                  />
                  <span className=''>Edit profile</span>
                </Button>
              )}
              <h2 className=' font-semibold text-2xl'>{user?.username}</h2>
              <p className=' text-md text-gray-600 text-ellipsis'>{user?.bio}</p>
            </div>
            <div className=' w-full px-0 mr-1'>
               <ProfileShares
                  user={user} 
               />
            </div>
          </div>
        </div>
        {selectedImg && (
          <ShowImg open={isOpen} handleImage={handleImage} img={selectedImg} />
        )}
    </div>
  )
}

export default ProfilePage;

