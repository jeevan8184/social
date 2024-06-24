"use client"
import UserForm from '@/components/related/UserForm'
import { getUser } from '@/lib/actions/User.actions'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const OnBoard = () => {
  const router=useRouter();

  useEffect(() => {
      const getAuthData = async () => {
        const user=await getUser();
        if(user) router.push('/');
      };
      getAuthData();
  }, []);

  const UserInitValues={
    username: '',
    bio:'',
    photo:''
}
  
  return (
    <section className=' wrapper  flex flex-col gap-2'>
      <div className=' flex flex-col'>
        <h2 className=' text-2xl font-semibold px-4 py-2'>Create Your profile</h2>
      </div>
      <div className='userForm'>
          <UserForm UserInitValues={UserInitValues} />
      </div>
      
    </section>
  )
}

export default OnBoard