import { IPost } from '@/lib/database/models/Post.model';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ShowImg from './ShowImg';


interface PostMapImagesProps {
    post:IPost,
    type?:'msg'
}

const PostMapImages = ({post,type}:PostMapImagesProps) => {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const imgRef=useRef<HTMLDivElement>(null);
    const [currIdx, setCurrIdx] = useState(0);

    const handleScroll=()=> {
        if(!imgRef.current) return;

        const scrollRight=imgRef.current?.scrollLeft
        const containerWidth=imgRef.current?.offsetWidth;
        setCurrIdx(Math.round(scrollRight/containerWidth));
    }

    useEffect(()=> {
        if(imgRef.current) {
            imgRef.current?.addEventListener('scroll',handleScroll);
            return ()=> imgRef.current?.removeEventListener('scroll',handleScroll);
        }
    },[imgRef])

    const handleImage=()=> {
        setIsOpen(false);
        setSelectedImage(null);
    }

  return (
    <div className=' relative p-0'>
        <div className={`relative overflow-x-auto snap-x snap-mandatory no-scrollbar ${type==='msg' ? ' w-60 max-w-60 h-60' :' w-80 max-w-80 '}`}
                ref={imgRef}>
                <div className=' flex gap-0 shrink-0'>
                    {post?.images?.length>0 && post.images.map((img,i)=> (

                        <div className=' snap-center snap-x rounded-xl' key={i}>
                            <div className=' flex-1 overflow-hidden rounded-xl'>
                                <div className={` relative ${type==='msg' ? ' h-60 w-60 backdrop-blur-sm bg-black':' h-96 w-80'}`}>
                                    <Image
                                        src={img}
                                        alt='image'
                                        layout='fill'
                                        className=' cursor-pointer object-cover overflow-hidden'
                                        onClick={()=> {
                                            setSelectedImage(img);
                                            setIsOpen(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
       </div>
        <div className=' absolute bottom-2 right-1/2 left-1/2 transform -translate-x-1/2 flex-center gap-0 text-white group flex-1'>
            {post.images?.length>1 && post.images.map((img,i)=> (
                <div 
                >
                    <FiberManualRecordIcon 
                        fontSize='small'
                        key={i} 
                        className={`${currIdx === i ? 'text-white ' : 'text-gray-400 '}`} 
                    />
                </div>
            ))}
        </div>
        {selectedImage && type !=='msg' && (
            <ShowImg open={isOpen} handleImage={handleImage} img={selectedImage}  />
        )}
    </div>
  )
}

export default PostMapImages
