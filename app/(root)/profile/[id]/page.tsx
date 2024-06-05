"use client"
import { getUserById } from '@/lib/actions/User.actions';
import ProfilePage from '@/components/shared/ProfilePage';
import { useEffect, useState } from 'react';
import { IUser } from '@/lib/database/models/User.model';

const Profile = ({params:{id}}:{params:{id:string}}) => {

  const [newUser, setNewUser] = useState<IUser | null>(null);

  useEffect(() => {
      const getAuthData = async () => {
        const user=await getUserById(id);
        setNewUser(user);
      };
      getAuthData();
  }, []);

  return (
    <div className=' profile flex flex-col text-wrap gap-4 overflow-hidden'>
      <div className=' flex w-full'>
        {newUser && (
          <ProfilePage 
            user={newUser}
            type="user"
          />
        )}
      </div>
    </div>
  )
}

export default Profile;
