"use client"

import Image from 'next/image'
import { Button } from '../ui/button';
import { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ModeSettings from './Mode';
import { ChatContext } from '../Message/ChatContext';
import { Logout } from '@/lib/actions/Auth.actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


const Navbar = () => {
  const router=useRouter();
  const pathname=usePathname();

  const hideNav=pathname.includes('/message/');
  const {currUser}=useContext(ChatContext);

  return (
    <section className={`navbar px-6 max-sm:px-2 ${hideNav ? ' max-sm:hidden':''}`}>
      <div className=' flex flex-row justify-between items-center z-0'>
        <div className=' flex gap-3  pl-5 max-sm:pl-0 items-center'>
            <Image
              src='/assets/icon/logo.svg'
              height={60}
              width={60}
              alt='image'
              className=''
              onClick={()=>router.push('/')}
            />
            <h1 className=" font-bold text-3xl font-serif from-neutral-900 dark:text-light-1">Threads</h1>
        </div>
        <div className=' flex items-center gap-2'>
            <div className=''>
              <ModeSettings />
            </div>
            {currUser ? (
              <div className=''>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className=' relative cursor-pointer h-11 w-11 
                      rounded-full object-contain object-center overflow-hidden bg-white p-1'>
                      <Image
                        src={currUser.photo}
                        layout='fill'
                        alt='image'
                        className=' ring-0 ring-offset-0 focus-visible:ring-offset-0'
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=' md:hidden absolute right-0 top-1 down dark:text-white'>
                    <DropdownMenuItem 
                      className='item'
                      onClick={()=> {
                        Logout();
                        router.push('/sign-in');
                      }}
                    >
                        Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
