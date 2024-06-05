"use client"

import { sidebarLinks } from '@/consants'
import { Logout } from '@/lib/actions/Auth.actions'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Sidebar = () => {
  const pathname=usePathname();
  const router=useRouter();
  const {theme,setTheme}=useTheme();
  const [mount, setMount] = useState(false);

  useEffect(()=> {
    setMount(true);
  },[])

  if(!mount) return null;
  
  return (
      <div className={`sidebar z-30 sticky top-0 h-screen flex flex-col justify-between w-full `}>
        <div className=' flex flex-col gap-2 w-full'>
          {sidebarLinks.map((link,i)=> {
            const isActive=pathname===link.route
            return (
              <Link
               key={link.route}
                href={link.route}
                className={` ${isActive ? ' dark:bg-blue-500 bg-blue-500 text-white' : ' bg-gray-300'} link w-full  `}
              >
                <Image
                  src={isActive || theme==='dark' ? link.image1 : link.image }
                  alt='image'
                  height={24}
                  width={24}
                  className={` font-bold text-black  dark:text-white`}
                />
                <p className=''>{link.label}</p>
              </Link>
            )
          })}
        </div>
        <div 
          className=' link w-full cursor-pointer bg-gray-300 '
          onClick={()=> {
            Logout();
            router.push('/sign-in');
          }}
        >
            <Image
              src='/assets/icon/logout.svg'
              alt='image'
              height={24}
              width={24}
              className=' font-bold text-black'
            />
            <p className=''>logout</p>
        </div>
      </div>
  )
}

export default Sidebar