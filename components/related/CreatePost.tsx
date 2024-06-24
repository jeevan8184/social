"use client"
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ChatContext } from '../Message/ChatContext'
import Loader from '../shared/Loader';
import Image from 'next/image';
import { formatDateTimeOpt } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { CameraIcon, Dot, ImageIcon, VideoIcon, X } from 'lucide-react';
import { useDropzone } from '@uploadthing/react';
import type {FileWithPath} from '@uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useUploadThing } from '@/lib/uploadthing';
import { createPost } from '@/lib/actions/Post.actions';
import { useRouter } from 'next/navigation';

const CreatePost = () => {
    const {currUser}=useContext(ChatContext);
    if(!currUser) return (
        <div className=' min-h-screen flex-center relative'>
            <Loader />
        </div>
    )

    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [Files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const {startUpload}=useUploadThing('imageUploader');
    const router=useRouter();
    

    const onDrop=useCallback((acceptedFiles:FileWithPath[])=> {
        for(let i=0;i<acceptedFiles.length;i++) {
            setFiles((prev)=> [...prev,acceptedFiles[i]]);
        }
    },[])

    const {getRootProps,getInputProps}=useDropzone({
        onDrop,
        accept:"image/*" ? generateClientDropzoneAccept(['image/*']):undefined ,
        multiple:true,
        // maxFiles:5,
    })

    const handleChange=async()=> {
        
        try {
            setIsProcessing(true);

            let imgUrls=[];
            if(Files.length>0) {
                for (let file of Files) {
                    const imgRes=await startUpload([file]);
                    if(!imgRes) return;
                    imgUrls.push(imgRes[0]?.url);
                }
            }
            const post=await createPost({
                creator:currUser._id,
                text,
                images:imgUrls,
                tags:tags? tags.split(',') :[]
            });
            console.log('post',post);

            setFiles([]);
            setText('');
            setTags('');

            if(post) router.push('/');
        } catch (error) {
            console.log(error);
        }finally{
            setIsProcessing(false);
        }
    }

    const filePreiews=useMemo(()=> {
        return Files.map((file)=> ({file,url:URL.createObjectURL(file)}))
    },[Files]);

  return (
            <div className=' flex flex-col my-2 w-full pr-2 pb-10'>
                <p className=' pl-4 pb-4'>create new posts and explore what like in realistic that changes your life</p>
                <div className=' flex gap-2'>
                    <div className=' flex-between flex-col gap-0.5'>
                        <div className=''>
                            <div className=' relative h-14 w-14 rounded-full '>
                                <Image
                                    src={currUser?.photo}
                                    alt='image'
                                    layout='fill'
                                    className=' rounded-full'
                                />
                            </div>
                        </div>
                        <div className=' h-full w-0.5 rounded-full bg-grey-500'></div>
                    </div>
                    <div className=' flex flex-col gap-3 w-full'>
                        <div className=' flex flex-col'>
                            <p className=' font-semibold'>{currUser.username}</p>
                            <p className=' text-[13px]'>{formatDateTimeOpt(currUser.createdAt).dateOnly}</p>
                        </div>
                        <div className=' flex flex-col gap-4 -ml-2'>
                            <div className=' flex w-full max-md:flex-col gap-4 justify-between'>
                                <Textarea
                                    className=' max-w-md border-gray-200 rounded-xl placeholder:text-gray-600 '
                                    placeholder='create a idea'
                                    value={text}
                                    onChange={(e)=> setText(e.target.value)}
                                />
                                <Input
                                    className='  border-gray-200 placeholder:text-gray-600 rounded-xl'
                                    value={tags}
                                    onChange={(e)=> setTags(e.target.value)}
                                    placeholder='#tag'
                                    onClick={(e)=> e.stopPropagation()}
                                />
                            </div>
                            <div className=' flex gap-4'>
                                <div {...getRootProps()} className=' cursor-pointer w-fit'>
                                    <input {...getInputProps()} multiple />
                                    <ImageIcon />
                                </div>
                                {/* <div className=' cursor-pointer'>
                                    <CameraIcon />
                                </div>
                                <div className=' cursor-pointer'>
                                    <VideoIcon />
                                </div> */}
                            </div>
                            {Files.length>0 && (
                            <div className=' flex flex-col  p-0'>
                                 <div className=' relative mt-4 max-w-3xl max-lg:max-w-xl w-full overflow-x-auto bg-grey-100 
                                     snap-x snap-mandatory snap-start h-full no-scrollbar py-4 max-md:max-w-sm max-sm:w-80
                                 '>
                                     <div className=' flex gap-8 max-sm:gap-6'>
                                         {filePreiews?.map(({file,url},i:number)=> (
                                             <div className=' snap-center shrink-0' key={i}>
                                                 <div className=' relative h-72 w-72 group '>
                                                     <Image
                                                        src={url}
                                                        layout='fill'
                                                        alt='image'
                                                        className=' rounded-xl object-cover group-hover:opacity-85 transition-opacity'
                                                     />
                                                     <div className=' absolute top-1 hidden group-hover:flex right-1 max-md:flex 
                                                         rounded-full p-2 cursor-pointer bg-grey-50 dark:bg-gray-800'
                                                         onClick={()=> {
                                                             setFiles((prev)=> {
                                                                const newFiles=prev.filter((f)=> f !==file)
                                                                return newFiles
                                                             })
                                                         }}
                                                     >
                                                         <X className=' h-5 w-5' />
                                                     </div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                            )}
                            {(text || Files.length>0) && (
                                <div className=' flex-between hidden '>
                                <Button
                                    className='cancel'
                                    disabled={isProcessing}
                                    onClick={()=> {
                                        setFiles([]);
                                        setText('');
                                        setTags('');
                                    } }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={!text || isProcessing }
                                    className=' rounded-full bg-blue-500 text-white hover:bg-blue-600'
                                    onClick={()=> handleChange()}
                                >
                                    {isProcessing ? (
                                        <div className=' flex gap-1'>
                                            <div className=' animate-spin'>
                                                <Image
                                                    src='/assets/icons/loader.svg'
                                                    height={20}
                                                    width={20}
                                                    className=''
                                                    alt='image'
                                                />
                                            </div>
                                            <p className=' text-white'>processing</p>
                                        </div>

                                    ): 'Submit' }
                                </Button>
                            </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
  )
}

export default CreatePost
