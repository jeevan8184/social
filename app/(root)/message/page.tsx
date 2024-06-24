
"use client"
import { ChatContext } from '@/components/Message/ChatContext';
import Allchats from '@/components/Message/chats/Allchats';
import { UserContext } from '@/components/UserProvider';
import Loader from '@/components/shared/Loader';
import SearchPage from '@/components/shared/SearchPage';
import { getUserSearchChats } from '@/lib/actions/Chat.actions';
import { IChat } from '@/lib/database/models/Chat.model';
import { searchParamsProps } from '@/lib/types';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const Message = ({searchParams}:searchParamsProps) => {

  const {allChats,isLoading}=useContext(UserContext);
  const {currUser}=useContext(ChatContext);
  const pathname=usePathname();
  const router=useRouter();

  const [allNewChats, setAllNewChats] = useState<IChat[]>(allChats);

  const searchText=(searchParams?.query as string) || "";
  const page=Number(searchParams?.page) || 1;

  useEffect(()=>{
    if(allChats) {
      setAllNewChats(allChats);
    }
  },[allChats]);

  useEffect(()=> {
    const newFunc=async()=>{
      try {
          if(searchText !=="") {
            const data=await getUserSearchChats({userId:currUser?._id,searchTerm:searchText,path:pathname});
            setAllNewChats(data);
          }else{
            setAllNewChats(allChats);
          }
      } catch (error) {
        console.log(error);
      }
    }
    newFunc();
  },[searchText]);

  if(isLoading) return <Loader />

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
              <Allchats allChats={allNewChats}  />
            </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Message;

