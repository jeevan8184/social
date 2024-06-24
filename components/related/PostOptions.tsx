
import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../Message/ChatContext';
import { addLikeToPost } from '@/lib/actions/Post.actions';
import { IPost } from '@/lib/database/models/Post.model';
import { savePostToUser } from '@/lib/actions/User.actions';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button';
import { IUser } from '@/lib/database/models/User.model';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UserContext } from '../UserProvider';
  

interface PostOptionsParams {
    post:IPost,
    setSavedPosts?:Dispatch<SetStateAction<IPost[]>>;
}

const PostOptions = ({post,setSavedPosts}:PostOptionsParams) => {

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<IPost["likes"]>(post?.likes);
    const {currUser,setCurrUser}=useContext(ChatContext);
    const {setNewPathname}=useContext(UserContext);
    const [isMarked, setIsMarked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router=useRouter();
    const {theme}=useTheme();
    const pathname=usePathname();

    const handleCheck=()=>{
        if(post && currUser) {
            const isLiked=post?.likes.some((l)=> l===currUser?._id);
            setLiked(isLiked);
            setIsMarked(currUser?.saved?.includes(post._id));
        }
    }

    useEffect(()=> {
        handleCheck();
    },[post,currUser]);

    const handleLike=async()=> {
        try {
            const newPost= await addLikeToPost({userId:currUser?._id,postId:post._id,path:pathname});
            if(newPost) {
                setLikes(newPost?.likes);
                setLiked((prev)=> !prev);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSave=async()=>{

        try {
            setIsSaving(true);
            const user=await savePostToUser(post._id,currUser._id,pathname);
            if(user) {
                setCurrUser(user);
                handleCheck();
                setIsMarked((prev)=> !prev);

                if(user?.saved.includes(post._id)) {
                    setSavedPosts && setSavedPosts((savedPosts)=> [...savedPosts,post]);
                }else{
                    setSavedPosts && setSavedPosts((savedPosts)=> {
                        const newSaved=savedPosts?.filter((s)=> s._id !==post._id);
                        return newSaved;
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsSaving(false);
        }
    }

    const img=isMarked ? '/assets/bottomIcons/bookmark.svg':'/assets/sideIcons/bookmark.svg'
    const newImg=theme==='dark'? isMarked ? '/assets/bottomIcons/bookmark1.svg':'/assets/sideIcons/bookmark1.svg' :img

  return (
    <div className=' flex gap-8 mx-8 pt-2 pr-2 flex-between w-80'>
        <div className=' flex gap-0'>
            <div className=''
                onClick={()=> handleLike()}
            >
                <Image
                    src={liked ? '/assets/icon/heart-filled.svg' : '/assets/icon/heart-gray.svg'}
                    alt='image'
                    height={30}
                    width={30}
                    className=''
                />
            </div>
            <p className=' text-[15px]'>{likes?.length}</p>
        </div>
        <div className=''>
            <div className=''>
                <Link href={`/comment?postId=${post._id}`}>
                    <Image
                        src='/assets/icon/reply.svg'
                        alt='image'
                        height={30}
                        width={30}
                        className=' cursor-pointer'
                    />
                </Link>
            </div>
        </div>
        <div className=''>
            <div className=''>
                <Image
                    src='/assets/icon/share.svg'
                    alt='image'
                    height={30}
                    width={30}
                    className=' cursor-pointer'
                    onClick={()=> {
                        setNewPathname(pathname); 
                        router.push(`/users?postId=${post._id}`);
                    }}
                />
            </div>
        </div>
        <div className=''>
            <div className=' cursor-pointer'>
                {isSaving ? (
                    <div className=' animate-spin'>
                        <Image
                            src='/assets/icons/loader.svg'
                            height={24}
                            width={24}
                            alt='image'
                            className=''
                        />
                    </div>
                ):(
                    <Image
                        src={newImg}
                        alt='image' 
                        height={24}
                        width={24}
                        className=''
                        onClick={()=> handleSave()}
                    />
                )}
                
            </div>
        </div>
    </div>
  )
}

export default PostOptions


// <div className=' sm:hidden'>
//                 <Drawer>
//                     <DrawerTrigger>
//                         <Image
//                             src='/assets/icon/share.svg'
//                             alt='image'
//                             height={30}
//                             width={30}
//                             className=' cursor-pointer'
//                         />
//                     </DrawerTrigger>
//                     <DrawerContent className=' bg-white h-5/6'>
//                         <DrawerHeader>
//                             <DrawerTitle>Share this post with your friends</DrawerTitle>
//                             <div className=' p-0 flex-start my-4 gap-5 grid grid-cols-2'>
//                                 {currUser?.friends.map((frnd:IUser)=> (
//                                     <div className=' border border-gray-400 px-8 py-1 rounded-xl mx-auto cursor-pointer active:bg-gray-100' key={frnd._id}>
//                                         <div className=' flex flex-col items-center gap-1'>
//                                             <div className=' relative h-20 w-20 rounded-full border border-blue-500 overflow-hidden'>
//                                                 <Image
//                                                     src={frnd.photo} 
//                                                     alt='image'
//                                                     layout='fill'
//                                                 />
//                                             </div>
//                                             <p className=''>{frnd.username}</p>
//                                             {/* <button className=' px-4 py-1.5 text-white rounded-full bg-blue-500'>share</button> */}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </DrawerHeader>
//                         <DrawerFooter>
//                             <Button className=' rounded-full text-white'>Submit</Button>
//                             <DrawerClose>
//                                 <Button variant="outline" className=' rounded-full w-full'>Cancel</Button>
//                             </DrawerClose>
//                         </DrawerFooter>
//                     </DrawerContent>
//                 </Drawer>
//             </div>