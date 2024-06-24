"use client"

import { ChatContext } from '@/components/Message/ChatContext'
import { UserContext } from '@/components/UserProvider';
import Loader from '@/components/shared/Loader';
import MapShareUsers from '@/components/shared/MapShareUsers';
import SearchPage from '@/components/shared/SearchPage';
import { Button } from '@/components/ui/button';
import { createChat } from '@/lib/actions/Chat.actions';
import { fetchUsers } from '@/lib/actions/User.actions';
import { IUser } from '@/lib/database/models/User.model';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useEffect, useState } from 'react'

const ShowUsersPageSuspense = () => {
    
    const {currUser,setpostAndUsers,isPending}=useContext(ChatContext);
    const {setAMsg,newPathname,setNewPathname}=useContext(UserContext);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const router=useRouter();
    const searchParams=useSearchParams();
    const postId=searchParams.get('postId');

    const page=Number(searchParams?.get('page')) || 1;
    const searchText=(searchParams?.get('query') as string) || '';

    useEffect(()=> {
        const newFunc=async()=>{
            try {
                const allUsers=await fetchUsers({
                    limit:100,
                    query:searchText,
                    page:page,
                    path:'/',
                })
                setAllUsers(allUsers?.data);
            } catch (error) {
                console.log(error);
            }
        }
        newFunc();
    },[searchText]);

    const handleSend=async()=>{
        try {
            if(selectedUsers.length>0 && postId) {
                const userIds=selectedUsers?.map((user)=> user._id);
                await Promise.all(
                    selectedUsers.map((user)=> (
                        createChat({senderId:currUser?._id,receiverId:user._id})
                    ))
                )
                setpostAndUsers({post:postId,users:userIds});
                setSelectedUsers([]);
    
                if(!isPending) {
                    setAMsg(true);
                    router.push(newPathname);
                    setNewPathname(null);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className=' flex flex-col gap-2 px-6 max-md:px-2 py-4'>
        <div className=' flex flex-col gap-3'>
            <button onClick={()=> {
                router.push(newPathname);
                setNewPathname(null);
            }}>
                <ArrowLeftIcon />
            </button>
            <div className=''>
                <SearchPage />
            </div>
        </div>
        <div className=' flex-between w-full pt-4 px-2 '>
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
                allUsers={allUsers}
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
            <ShowUsersPageSuspense  />
        </Suspense>
    )
}

export default ShowUsersPage;
