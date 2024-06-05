"use client"
import ProfilePage from '@/components/shared/ProfilePage';
import { useContext } from 'react';
import { ChatContext } from '@/components/Message/ChatContext';
import Loader from '@/components/shared/Loader';

const Profile = () => {

  const {currUser}=useContext(ChatContext);

  if(!currUser) return <Loader />
  return (
    <div className=' profile flex flex-col gap-4 overflow-hidden text-wrap w-full'>
      <div className=''>
        {currUser && (
          <ProfilePage user={currUser} />
        )}
      </div>
    </div>
  )
}

export default Profile
