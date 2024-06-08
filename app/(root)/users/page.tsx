"use client"

import { ChatContext } from '@/components/Message/ChatContext'
import Loader from '@/components/shared/Loader';
import MapShareUsers from '@/components/shared/MapShareUsers';
import { Button } from '@/components/ui/button';
import { IUser } from '@/lib/database/models/User.model';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useState } from 'react'

const ShowUsersPageSuspense = () => {
    
    const {currUser,setpostAndUsers,isPending}=useContext(ChatContext);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

    const router=useRouter();
    const searchParams=useSearchParams();
    const postId=searchParams.get('postId');

    console.log('postIdd',postId);

    const handleSend=()=>{
        if(selectedUsers.length>0 && postId) {
            const userIds=selectedUsers?.map((user)=> user._id);
            setpostAndUsers({post:postId,users:userIds});
            setSelectedUsers([]);

            if(!isPending) {
                router.back();
            }
        }
    }

  return (
    <div className=' flex flex-col gap-2 px-6 max-md:px-2 py-4'>
        <button onClick={()=> router.back()}>
            <ArrowLeftIcon />
        </button>
        <div className=' flex-between w-full pt-4 '>
            <h1 className=' font-semibold text-xl ml-3'>Users</h1>
            <div className=''>
                <Button
                    className=' text-white rounded-full px-6'
                    onClick={()=> handleSend()}
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className=' flex gap-1'>
                            <div className=' animate-spin'>
                                <Image
                                    src='/assets/icons/loader.svg'
                                    height={20}
                                    width={20}
                                    className=''
                                    alt='image'
                                />
                            </div>
                            <p className=' text-white'>processing</p>
                        </div>
                    ): 'Send' }

                </Button>
            </div>
        </div>
       <div className=' md:px-1'>
            <MapShareUsers 
                allUsers={currUser?.friends}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
            />
        </div>
    </div>
  )
}


const ShowUsersPage=()=>{
    return (
        <Suspense fallback={<Loader />}>
            <ShowUsersPageSuspense />
        </Suspense>
    )
}

export default ShowUsersPage;
