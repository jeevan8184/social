"use client"

import { IUser } from '@/lib/database/models/User.model'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface MapUsersprops {
  allUsers:IUser[],
  totalPages:number | undefined
}

const MapUsers = ({allUsers,totalPages}:MapUsersprops) => {

  const router=useRouter();

  return (
    <section className=' rounded-2xl px-1 py-2'>
      <div className=' flex flex-1 flex-col gap-2'>
        {allUsers?.map((user)=> (
          <div className=' bg-slate-100 dark:bg-dark-4 opacity-90 rounded-full px-1'>
            <div className=' flex-between'>
              <div className=' flex gap-2 items-center'>
                <div className=' relative rounded-full h-11 w-11 overflow-hidden'>
                  <Image
                    src={user.photo}
                    alt='image'
                    layout='fill'
                  />
                </div>
                <p className=''>{user.username}</p>
              </div>
              <Button
                className=' rounded-full px-4 text-white'
                onClick={()=> router.push(`/profile/${user._id}`) }
              >
                view
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MapUsers
