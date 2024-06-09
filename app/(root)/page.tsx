"use client"

import NewImages from '@/components/related/NewImages';
import Postcard from '@/components/related/Postcard';
import { getAllPosts } from '@/lib/actions/Post.actions';
import { IPost } from '@/lib/database/models/Post.model';
import { searchParamsProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loader from '@/components/shared/Loader';
import Threads from '@/components/related/threads';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

const Home = ({searchParams}:searchParamsProps) => {

  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const page=Number(searchParams?.page) || 1;
  const {theme,setTheme}=useTheme();
  const pathname=usePathname();

  console.log('theme',theme);

  useEffect(()=> {
    const newFunc=async()=> {
      const data=await getAllPosts({limit:5,page,path:pathname});
      console.log('allPostssss',data);
      setAllPosts(data.allPosts);
       
      if(theme===undefined) {
        setTheme('light');
      }
    }
    newFunc();
  },[])

  const imgPosts=allPosts.filter((post)=> post?.images.length>0);
  const posts=allPosts.filter((post)=> post?.images.length<1);

  if(allPosts.length<1) return <Loader />

  console.log('allPosts',allPosts);

  return (
    <div className=' flex flex-col gap-4 h-full justify-between pb-20'>
      <div className=' flex flex-col py-3 gap-4'>
        <div className=' flex flex-col'>
          <NewImages />
          <div className=' w-full'>
            <Tabs defaultValue="photos" className=" w-full">
              <TabsList className=' m-5 flex gap-4'>
                <TabsTrigger value="photos" className=' tab'>Photos</TabsTrigger>
                <TabsTrigger value="threads" className=' tab'>Threads</TabsTrigger>
              </TabsList>
              <TabsContent value="photos" className=' w-full'>
                <div className=' flex flex-col gap-4 w-full mx-auto py-4'>
                  {imgPosts?.length>0 && imgPosts.map((post)=> (
                    <div className=' mx-auto' key={post._id}>
                      <Postcard post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="threads">
                <div className=' flex flex-col gap-6 w-full py-4 justify-center overflow-hidden'>
                  {posts?.length>0 && posts.map((post)=> (
                    <div className=' flex flex-1 flex-col ml-9 mr-3 xl:ml-20 max-sm:ml-3 max-w-xl border border-light-2 rounded-xl' key={post._id}>
                      <Threads post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;

