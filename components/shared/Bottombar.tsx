"use client"

import { sidebarLinks } from '@/consants'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Bottombar = () => {
  const pathname=usePathname();
  const hideBottom=pathname.includes('/message/');
  const {theme}=useTheme();
  const [mount, setMount] = useState(false);

  useEffect(()=> {
    setMount(true);
  },[])

  if(!mount) return null;

  return (
    <div className={` border-t-0  bg-[#F5F5F5] w-full dark:bg-gray-800  sm:hidden flex fixed bottom-0 px-2 pt-1 z-50 ${hideBottom ?'hidden' : ''}`}>
      <div className=' flex flex-row gap-2 w-full flex-between'>
          {sidebarLinks.map((link,i)=> {
            const isActive=pathname===link.route
            return (
              <Link
                key={i}
                href={link.route}
                className={` ${isActive ? 'text-blue-500' : ''} link1   `}
              >
                <Image
                  src={isActive ? link.image2 : theme==='dark' ? link.image1 : link.image}
                  alt='image'
                  height={24}
                  width={24}
                  className=' font-bold  text-black'
                />
                <p className={`text-[13px] ${isActive ? ' text-blue-500':`${theme==='dark' ? 'text-gray-300':'text-black'}`}`}>{link.label}</p>
              </Link>
            )
          })}
        </div>
    </div>
  )
}

export default Bottombar
