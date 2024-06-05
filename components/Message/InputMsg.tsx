import { SendHorizonal, Upload, X } from 'lucide-react'
import React, { useCallback, useContext, useState } from 'react'
import { Input } from '../ui/input'
import { ChatContext } from './ChatContext';
import { useDropzone } from '@uploadthing/react';
import type {FileWithPath} from '@uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client';
import Image from 'next/image';

const InputMsg = () => {
  const {setNewMsg,setIsTyping}=useContext(ChatContext);

  const [text, setText] = useState('');
  const [Files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState<string>();
 
  const handleSendMsg=()=>{
    if(text.trim() !=='') {
      setNewMsg({text});
      setText('');
    }else if(Files) {
      setNewMsg({image:Files});
      setFiles([]);
      setValue('');
    }
  }

  const onDrop=useCallback((acceptedFiles:FileWithPath[])=> {
    setFiles(acceptedFiles);
    setValue(URL.createObjectURL(acceptedFiles[0]));
    
  },[]);

  const {getRootProps,getInputProps}=useDropzone({ 
    onDrop,
    accept:'image/*' ? generateClientDropzoneAccept(['image/*']):undefined
  })
  
  return (
        <div className=' flex-center w-full mx-1'>
          <div className=' max-md:gap-1 fixed bottom-1 max-sm:bottom-0 mb-1 max-sm:w-full overflow-hidden'>
            <div className=' w-full flex items-center gap-3 max-sm:gap-0.5'>
              <div className=' flex type dark:bg-dark-4 overflow-hidden'>
                <div className=' cursor-pointer'> 
                  <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Upload className=' h-5 w-5 font- normal' />
                  </div>
                </div>
                <Input
                  placeholder='message..'
                  value={text}
                  autoFocus
                  onKeyDown={(e)=> e.key==='Enter' && handleSendMsg()}
                  onChange={(e)=> {
                    setText(e.target.value);
                    e.target.value ? setIsTyping(true): setIsTyping(false);
                  }}
                  className=' border-none focus-visible:ring-0 placeholder:text-gray-600'
                />
                <div className='relative'>
                  {value && (
                    <div className=' group block rounded-sm h-12 w-14 '>
                      <div className=' absolute top-0 right-1 '
                        onClick={()=> {
                          setValue('');
                          setFiles([]);
                        }}
                      >
                        <X className=' rounded-full z-40 p-2 bg-gray-300 cursor-pointer hidden group-hover:flex' />
                      </div>
                      <div className=''>
                        <Image
                          src={value}
                          alt='image'
                          height={50}
                          width={50}
                          className=' overflow-hidden border-none  '
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className=''>
                <button
                  className=' bg-blue-600/10 text-blue-500 px-4 py-2 rounded-2xl flex gap-0'
                  onClick={handleSendMsg}
                  >
                    <SendHorizonal className=' h-5 w-5 font-normal' />
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default InputMsg;
