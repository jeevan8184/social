"use client"
import UserForm from '@/components/related/UserForm'
import Loader from '@/components/shared/Loader'
import { getUserById } from '@/lib/actions/User.actions'
import { IUser } from '@/lib/database/models/User.model'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const OnBoard = ({params:{id}}:{params:{id:string}}) => {
    
    const pathname=usePathname();
    const [newUser, setNewUser] = useState<IUser>();

    useEffect(()=>{
        const newFunc=async()=>{
            if(id) {
                try {
                    const user=await getUserById(id,pathname);
                    setNewUser(user);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        newFunc();
    },[id]);

    if(!newUser) return <Loader />

    const UserInitValues={
        username: newUser.username,
        bio: newUser.bio,
        photo: newUser.photo
    }

  return (
    <section className=' wrapper  flex flex-col gap-2'>
      <div className=' flex flex-col'>
        <h2 className=' text-2xl font-semibold px-4 py-2'>Update Your profile</h2>
      </div>
      <div className='userForm'>
          <UserForm UserInitValues={UserInitValues} id={id} />
      </div>
      
    </section>
  )
}

export default OnBoard;
