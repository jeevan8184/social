"use client"

import Image from 'next/image'
import React, { Suspense, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import Loader from './Loader'

interface SearchPageProps {
    placeholder?:string
}
const SearchPageSuspense = ({placeholder}:SearchPageProps) => {
    const [text, setText] = useState('');
    const searchParams=useSearchParams();
    const router=useRouter();

    useEffect(()=> {
        let newUrl='';
        
        const debounceFn=setTimeout(()=> {
            if(text) {
                newUrl=formUrlQuery({
                    params:searchParams.toString(),
                    key:'query',
                    value:text
                })
            }else{
                newUrl=removeKeysFromQuery({
                    params:searchParams.toString(),
                    keysToRemove:['query']
                })
            }
            router.push(newUrl,{scroll:false});
        },100)

        return ()=> clearTimeout(debounceFn);

    },[text,router,searchParams])

  return (
    <div className='px-4 rounded-full bg-gray-50 flex gap-2 border border-gray-500 max-w-md dark:bg-black'>
        <Image 
            src='/assets/icons/search.svg'
            height={24}
            width={24}
            alt='search'
            className=''
        />
        <Input
            placeholder={placeholder ? placeholder : 'Search username'}
            value={text}
            onChange={(e)=> setText(e.target.value)}
            className=' focus-visible:ring-0 rounded-full dark:placeholder:text-slate-200
                focus-visible:ring-offset-0 border-none bg-gray-50 dark:bg-black'
        />
    </div>
  )
}


const SearchPage=()=>{
    return (
        <Suspense fallback={<Loader />}>
            <SearchPageSuspense />
        </Suspense>
    )
}

export default SearchPage;
