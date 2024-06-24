import { SendHorizonal, Upload, X } from 'lucide-react'
import React, { useCallback, useContext, useState } from 'react'
import { Input } from '../ui/input'
import { ChatContext } from './ChatContext';
import { useDropzone } from '@uploadthing/react';
import type {FileWithPath} from '@uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client';
import Image from 'next/image';
import { UserContext } from '../UserProvider';

const InputMsg = () => {
  const {setNewMsg,setIsTyping,isLoading}=useContext(ChatContext);
  const {setReLoad}=useContext(UserContext);

  const [text, setText] = useState('');
  const [Files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState<string>();
 
  const handleSendMsg=()=>{
    if(text.trim() !=='') {
      setNewMsg({text});
      setReLoad(true);
      setText('');
    }else if(Files) {
      setNewMsg({image:Files});
      setFiles([]);
      setValue('');
      setReLoad(true);
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
        <div className=' flex-center sticky bottom-0 border-t border-gray-200 dark:border-none shadow-sm py-1 px-4 w-full h-fit z-50 overflow-hidden bg-white dark:bg-dark-1 dark:shadow-xl'>
          <div className=''>
            <div className=' w-full flex items-center gap-3 max-sm:gap-0.5 max-sm:px-1'>
              <div className=' flex type dark:bg-dark-4 overflow-hidden flex-grow'>
                <div className=' cursor-pointer'> 
                  <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Upload className=' h-5 w-5 font- normal' />
                  </div>
                </div>
                <Input
                  placeholder='message..'
                  value={text}
                  onKeyDown={(e)=> e.key==='Enter' && handleSendMsg()}
                  onChange={(e)=> {
                    setText(e.target.value);
                    e.target.value ? setIsTyping(true): setIsTyping(false);
                  }}
                  className=' w-full border-none focus-visible:ring-0 placeholder:text-gray-600'
                />
                <div className=''>
                  {value && (
                    <div className=''>
                      <div className=' relative h-16 w-16 rounded-md'>
                        <Image
                          src={value}
                          alt='image'
                          layout='fill'
                          className=' border-none rounded-md'
                        />
                        <div className=' absolute top-0 right-0 '
                          onClick={()=> {
                            setValue('');
                            setFiles([]);
                          }}
                        >
                          <X className=' rounded-full z-40 p-2 bg-gray-300 dark:bg-slate-900 cursor-pointer' />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className=' z-50 mr-1 '>
                <button
                  className=' bg-blue-600/10 text-blue-500 px-4 py-2 rounded-2xl flex gap-0 active:text-blue-600 active:bg-blue-600/20'
                  onClick={handleSendMsg}
                  >
                    {isLoading ? (
                      <div className=' animate-spin flex-center'>
                        <Image
                          src='/assets/icons/loader.svg'
                          alt='loader'
                          height={24}
                          width={24}
                          className=''
                        />
                      </div>
                    ):(
                      <SendHorizonal className=' h-5 w-5 font-normal' />
                    )}
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default InputMsg;
