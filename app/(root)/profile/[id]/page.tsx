"use client"
import { getUserById } from '@/lib/actions/User.actions';
import ProfilePage from '@/components/shared/ProfilePage';
import { useEffect, useState } from 'react';
import { IUser } from '@/lib/database/models/User.model';
import { usePathname } from 'next/navigation';

const Profile = ({params:{id}}:{params:{id:string}}) => {

  const [newUser, setNewUser] = useState<IUser | null>(null);
  const pathname=usePathname();

  useEffect(() => {
      const getAuthData = async () => {
        const user=await getUserById(id,pathname);
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
