"use client"

import { HomeImages } from '@/consants'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const NewImages = () => {
    const [liked, setLiked] = useState<number>();
    const router=useRouter();

  return (
    <div className=' flex flex-col gap-4 mt-5 mb-3'>
        <h2 className=' font-[500] text-xl px-3'>Create your own posts that you like</h2>
        <div className=' relative snap-x snap-mandatory overflow-x-auto no-scrollbar
           bg-grey-50 dark:bg-dark-4 max-w-4xl max-lg:max-w-xl max-md:max-w-md pl-2 lg:px-6 h-full py-4 px-2 '
        >
            <div className=' flex gap-8'>
                {HomeImages.map((images,i)=> (

                    <div className=' snap-center shrink-0' key={i}>
                        <div className=' relative h-72 w-64 group '>
                            <Image
                                src={images.img}
                                alt='image'
                                layout='fill'
                                className='object-cover hover:animate-in rounded-xl group-hover:opacity-90 hover:ease-in
                                        transition-opacity ease-in duration-1000  group-hover:scale-105 scroll-mr-0'
                            />
                            <div className=' absolute top-1 right-1 bg-grey-50 p-1 rounded-full '
                                onClick={()=> setLiked(i)}
                            >
                                <Image
                                    src={liked==i ? '/assets/icon/heart-filled.svg' : '/assets/icon/heart-gray.svg'}
                                    alt='image'
                                    height={24}
                                    width={24}
                                    className=''
                                />
                            </div>
                            <div className=' cursor-pointer absolute left-1 bottom-4 hidden group-hover:flex flex-col gap-1'
                                onClick={()=> router.push('/create')}
                            >
                                <p className='  rounded-full p-1 bg-grey-50 w-fit dark:bg-dark-4 dark:text-white '><PlusIcon /></p>
                                <p className=' text-white text-sm'>{images.label}</p>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>

  )
}

export default NewImages
