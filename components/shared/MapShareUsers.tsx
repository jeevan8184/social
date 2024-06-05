import { IUser } from '@/lib/database/models/User.model'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { ChatContext } from '../Message/ChatContext'
import Loader from './Loader'

interface MapShareUsersProps {
    allUsers:IUser[],
    setSelectedUsers:Dispatch<SetStateAction<IUser[]>>,
    selectedUsers:IUser[]
}

const MapShareUsers = ({allUsers,setSelectedUsers,selectedUsers}:MapShareUsersProps) => {

    const {currUser}=useContext(ChatContext);
    if(!currUser) return <Loader/>

    const handleSelect=(newUser:IUser)=>{
        setSelectedUsers((selectedUsers)=> {
            const isUser=selectedUsers?.some((user)=>user._id===newUser._id );
            if(isUser) {
                return selectedUsers.filter((user)=> user._id !==newUser._id);
            }else {
                return [...selectedUsers,newUser]
            }
        })
    }

  return (
    <section className=' rounded-2xl px-1 py-2'>
        <div className=' flex flex-1 flex-col gap-2'>
        {allUsers?.map((user)=> (
            <div className=' bg-slate-100 dark:bg-dark-4 rounded-xl cursor-pointer px-4 py-0.5'
                onClick={()=> handleSelect(user)}
            >
                <div className=' flex-between'>
                    <div className=' flex gap-2 items-center'>
                        <div className=' relative rounded-full h-11 w-11 overflow-hidden'>
                            <Image
                            src={user.photo}
                            alt='image'
                            layout='fill'
                            />
                        </div>
                        <p className=' font-[500]'>{user.username}</p>
                    </div>
                    <div className=''>
                        {selectedUsers?.includes(user) && (
                            <p className=' text-green-500 p-1'>
                                <CheckIcon className=' size-7 rounded-full bg-white dark:bg-dark-2 text-2xl'/>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        ))}
        </div>
  </section>
  )
}

export default MapShareUsers;
