import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface ShowImgProps {
    open:boolean,
    handleImage:()=>void,
    img:string | null,
}

const ShowImg = ({open,handleImage,img}:ShowImgProps) => {

    if(!open || !img) return null;

  return (
    <div className=' bg-black bg-opacity-75 flex-center inset-0 fixed z-50 flex-1'>
        <div className=' w-fit bg-white'>
            <div className=' relative h-[500px] max-sm:h-[400px] max-sm:w-[300px] w-[450px] group'>
                <Image
                    src={img}
                    alt='image'
                    layout='fill'
                    className=' object-contain'
                />
                <p 
                    className=' p-1 bg-gray-200 rounded-full absolute top-0 right-1/4 
                        slide-out-to-left-1/4 cursor-pointer group-hover:flex dark:bg-gray-700 dark:text-white'
                    onClick={handleImage}
                >
                    <X />
                </p>
            </div>
        </div>
    </div>
  )
}

export default ShowImg;
