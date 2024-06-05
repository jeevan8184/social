
"use client"
import Allchats from '@/components/Message/chats/Allchats';
import { UserContext } from '@/components/UserProvider';
import Loader from '@/components/shared/Loader';
import SearchPage from '@/components/shared/SearchPage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const Message = () => {

  const {allChats}=useContext(UserContext);
  const router=useRouter();

  if(!allChats) return <Loader />

  return (
    <div className=''>
      {allChats.length<1 ? (
        <div className=' relative flex-center flex-col gap-3 mt-40'>
          <Image
              src='/assets/nochats.png'
              height={150}
              width={150}
              alt='image'
          />
          <div className=' flex flex-col gap-1 flex-center'>
              <h2 className=' text-xl font-semibold'>No chats found</h2>
              <button className=' text-blue-500 text-lg' onClick={()=> router.push('/search')}>Lets create new chats with friends</button>
          </div>
        </div>
      ):(
        <div className=' py-4 lg:px-4 px-2'>
          <div className=' flex flex-col gap-4'>
            <div className=''>
              <SearchPage />
            </div>
            <div className=' flex flex-col gap-6'>
              <Allchats allChats={allChats} />
            </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Message;