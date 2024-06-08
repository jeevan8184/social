"use client"

import Image from 'next/image'
import { Button } from '../ui/button';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModeSettings from './Mode';
import { ChatContext } from '../Message/ChatContext';
import Loader from './Loader';


const Navbar = () => {
  const router=useRouter();

  const {currUser}=useContext(ChatContext);

  return (
    <section className=' navbar px-6'>
      <div className=' flex flex-row justify-between items-center z-0'>
        <div className=' flex gap-3  pl-5 max-sm:pl-0 items-center'>
            <Image
              src='/assets/icon/logo.svg'
              height={60}
              width={60}
              alt='image'
              className=''
            />
            <h1 className=" font-bold text-3xl font-serif from-neutral-900 dark:text-light-1 max-sm:hidden">Social Media</h1>
        </div>
        <div className=' flex items-center gap-2'>
            <div className=''>
              <ModeSettings />
            </div>
            {currUser ? (
              <div className=' relative cursor-pointer h-11 w-11 
                 rounded-full object-contain object-center overflow-hidden bg-white p-1'>
                <Image
                  src={currUser.photo}
                  layout='fill'
                  alt='image'
                  className=''
                />
              </div>
            ):(
              <Button
                className=' rounded-full text-white'
                onClick={()=> router.push('/sign-in')}
              >
                login
              </Button>
            )}
        </div>
      </div>
    </section>
  )
}

export default Navbar
