"use client"
import UserForm from '@/components/related/UserForm'
import { getUser } from '@/lib/actions/User.actions'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IUser } from '@/lib/database/models/User.model'

const OnBoard = () => {
  const router=useRouter();

  const [newUser, setNewUser] = useState<IUser | null>(null);

  useEffect(() => {
      const getAuthData = async () => {
        const user=await getUser();
        if(user) router.push('/');
        setNewUser(user);
      };
      getAuthData();
  }, []);
  
  return (
    <section className=' wrapper  flex flex-col gap-4'>
      <div className=' flex flex-col gap-2'>
        <h2 className=' text-2xl font-semibold'>Create Your profile</h2>
      </div>
      <div className='userForm'>
          <UserForm />
      </div>
      
    </section>
  )
}

export default OnBoard