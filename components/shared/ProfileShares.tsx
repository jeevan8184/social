import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from '@/consants'
import Image from 'next/image'
import { IUser } from '@/lib/database/models/User.model'
import { IPost } from '@/lib/database/models/Post.model'
import { deletePost, getAllUserPosts } from '@/lib/actions/Post.actions'
import Postcard from '../related/Postcard'
import { usePathname, useRouter } from 'next/navigation'
import { getRepliesOfUser, getUserSavedPosts } from '@/lib/actions/User.actions'
import RepliesPage from './RepliesPage'
import { IComment } from '@/lib/database/models/Comments.model'
import Threads from '../related/threads'
import Loader from './Loader'

interface ProfileSharesProps {
    user:IUser,
}

const ProfileShares = ({user}:ProfileSharesProps) => {

    const [allPosts, setAllPosts] = useState<IPost[]>([]);
    const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
    const [replies, setReplies] = useState<Array<{comments:IComment[],postId:IPost}>>([]);
    const [value, setValue] = useState<string>('photos');
    const [isLoading, setIsLoading] = useState(false);

    const [delPost, setDelPost] = useState<IPost | null>(null);
    const pathname=usePathname();
    const router=useRouter();
  
    useEffect(()=> {
      const newFunc=async()=> {
        try {
            setIsLoading(true);
            const data=await getAllUserPosts({limit:5,page:1,userId:user._id,path:pathname});
            setAllPosts(data.allPosts);

            const newData=await getUserSavedPosts(user._id,pathname);
            setSavedPosts(newData);

            const replies=await getRepliesOfUser(user._id,pathname);
            setReplies(replies);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
      }
      newFunc();
    },[]);
    
    useEffect(()=> {
        const newFunc=async()=>{
            if(delPost) {
                try {
                    const post=await deletePost(delPost._id,pathname);
                    if(post) {
                        setAllPosts((posts)=> {
                            const newPosts=posts.filter((p)=> p._id !==post._id);
                            return newPosts;
                        })
                    }
                    setDelPost(null);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        newFunc();
    },[delPost]);

    const imgPosts=allPosts.filter((post)=> post?.images.length>0);
    const posts=allPosts.filter((post)=> post?.images.length<1);
    

    if(isLoading) return <Loader />

    return (
    <div className=' w-full pb-20 px-2'>
        <Tabs defaultValue="posts" className=" w-full px-0">
            <TabsList className=' max-w-sm lg:max-w-xl  flex-between max-md:flex-between max-md:w-full w-full gap-1'>
                {profileTabs.map((tab,i)=> (
                    <TabsTrigger value={tab.value} key={i} className='tab'>
                        <Image
                            src={tab.icon}
                            alt='image'
                            height={24}
                            width={24}
                        />
                        <p className=' text-[16px]'>{tab.label}</p>
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="posts">
                <Tabs defaultValue="photos" className=" w-full pt-5" >
                    <TabsList>
                        <TabsTrigger value="photos" className='tab1 group' onClick={()=>setValue('photos') }>
                            <span className={`text-[17px] ${value==='photos' ? 'underline-custom':''}`}>photos</span>
                        </TabsTrigger>
                        <TabsTrigger value="threads" className='tab1 ' onClick={()=>setValue('threads') }>
                            <span className={`text-[17px] ${value==='threads' ? 'underline-custom':''}`}>threads</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="photos">
                        <div className=' flex flex-col gap-4 mx-auto py-4 mb-20'>
                            {imgPosts?.length>0 ? (
                                <div className=''>
                                    {imgPosts.map((post)=> (
                                        <div className=' max-w-sm ' key={post._id}>
                                        <Postcard post={post} type={!pathname.includes('/profile/') ? 'profile':undefined} setDelPost={setDelPost} setSavedPosts={setSavedPosts} />
                                    </div>
                                    ))}
                                </div>
                            ):(
                                <div className=' flex-center flex-col gap-2 mt-8'>
                                    <h1 className=' text-xl font-semibold'>No Posts found</h1>
                                    <button className=' font-bold text-blue-500' onClick={()=> router.push('/create') }>Create new Posts</button>
                                </div>
                            )}
                        </div> 
                    </TabsContent>
                    <TabsContent value="threads">
                        <div className=' flex flex-col gap-6 w-full py-4 justify-center'>
                            {posts?.length>0 ? posts.map((post)=> (
                            <div className=' flex flex-1 flex-col ml-9 mr-3 xl:ml-20 max-sm:ml-3 max-w-xl border border-light-2 rounded-xl' key={post._id}>
                                <Threads post={post} type={!pathname.includes('/profile/') ? 'profile':undefined} setDelPost={setDelPost} setSavedPosts={setSavedPosts} />
                            </div>
                            )):(
                                <div className=' flex-center flex-col gap-2 mt-8'>
                                    <h1 className=' text-xl font-semibold'>No Posts found</h1>
                                    <button className=' font-bold text-blue-500' onClick={()=> router.push('/create') }>Create new Posts</button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </TabsContent>
            <TabsContent value="replies">
                <RepliesPage replies={replies} />
            </TabsContent>
            <TabsContent value="saved">
                <div className=' flex flex-col gap-4 mx-auto py-4 mb-20'>
                    {savedPosts?.length>0 ? (
                        <div className=''>
                            {savedPosts.map((post)=> (
                                <div className=' max-w-sm ' key={post._id}>
                                <Postcard post={post} setDelPost={setDelPost} setSavedPosts={setSavedPosts} />
                            </div>
                            ))}
                        </div>
                    ):(
                        <div className=' flex-center flex-col gap-2 mt-8'>
                            <h1 className=' text-xl font-semibold'>No Posts found</h1>
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ProfileShares
