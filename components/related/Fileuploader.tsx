"use client"

import React, { Dispatch, SetStateAction, useCallback } from 'react'
import {useDropzone} from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import type { FileWithPath } from '@uploadthing/react'
import Image from 'next/image'
import { Button } from '../ui/button'

interface FileuploaderProps {
  value:string,
  handleChange:(value:string)=>void, 
  setFiles:Dispatch<SetStateAction<File[]>>
}

const Fileuploader = ({value,handleChange,setFiles}:FileuploaderProps) => {

  const onDrop=useCallback((acceptedFiles:FileWithPath[])=> {
    setFiles(acceptedFiles);
    handleChange(URL.createObjectURL(acceptedFiles[0])); 
  },[]);

  const {getRootProps,getInputProps}=useDropzone({
    onDrop,
    accept:'image/*'?generateClientDropzoneAccept(['image/*']):undefined
  })



  return (
    <div {...getRootProps()} className=' flex-center cursor-pointer bg-grey-50 dark:bg-dark-4 rounded-2xl h-72'>
      <input {...getInputProps()} />
      {value ? (
        <div className=' relative h-64 w-full cursor-pointer bg-grey-50 dark:bg-dark-4 rounded-xl overflow-hidden '>
          <Image
            src={value}
            layout='fill'
            alt='image'
            className=' w-full h-full '
          />
        </div>
      ):(
        <div className=' flex-center flex-col  gap-2 text-gray-500 cursor-pointer '>
          <Image
            src='/assets/icons/upload.svg'
            height={44}
            width={44}
            className=''
            alt='image'
          />
          <h2 className=''>upload image</h2>
          <Button type='button' className=' rounded-full text-white'>upload button</Button>
        </div>
      )}
    </div>
  )
}

export default Fileuploader
