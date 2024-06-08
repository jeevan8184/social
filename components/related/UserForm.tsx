"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSchema } from '@/lib/validations'
import { UserInitValues } from '@/consants'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Fileuploader from './Fileuploader'
import { Textarea } from '../ui/textarea'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing'
import { createUser } from '@/lib/actions/User.actions'
import { usePathname, useRouter } from 'next/navigation'

interface UseFormprops {
    authId:string | undefined
}
const UserForm = () => {

    const [Files, setFiles] = useState<File[]>([]);
    const {startUpload}=useUploadThing('imageUploader');
    const router=useRouter();
    const pathname=usePathname();

    const form=useForm<z.infer<typeof UserSchema>>({
        resolver:zodResolver(UserSchema),
        defaultValues:UserInitValues
    })

    async function onSubmit(values:z.infer<typeof UserSchema>) {
        console.log(values);
        let uploadImage=values.photo;

        try {
            const newImage=await startUpload(Files);
            if(!newImage) return;
            
            uploadImage=newImage[0]?.url;

            const newUser=await createUser({
                username:values.username,
                bio:values.bio,
                photo:uploadImage,
                path:pathname
            })

            console.log('newUser',newUser);
            
            if(newUser) router.push('/');

        } catch (error) {
            console.log(error);
        }
        
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8 pb-8' >
            <FormField
                control={form.control}
                name='username'
                render={({field})=> (
                    <FormItem>
                        <FormLabel className=' ml-2'>Username</FormLabel>
                        <FormControl>
                            <Input autoFocus {...field} placeholder='username' className=' input max-w-md dark:bg-dark-4 focus-visible:ring-0' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className=' flex flex-col md:flex-row gap-4 md:gap-6 '>
                <FormField
                    control={form.control}
                    name='bio'
                    render={({field})=> (
                        <FormItem className=' w-full flex flex-col gap-2 h-72 '>
                            <FormLabel className=' ml-2'>bio</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder='add your bio ' className=' dark:bg-dark-4 h-72 w-full textarea focus-visible:ring-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='photo'
                    render={({field})=> (
                        <FormItem className=' w-full flex flex-col gap-2 h-72 '>
                            <FormLabel className=' ml-2'>Upload photo</FormLabel>
                            <FormControl>
                                <Fileuploader 
                                    value={field.value}
                                    handleChange={field.onChange}
                                    setFiles={setFiles}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button 
                type='submit'
                className=' rounded-full px-6 py-2 mt-4'
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? (
                    <div className=' text-white flex gap-1'>
                        <div className=' animate-spin'>
                            <Image
                                src='/assets/icons/loader.svg'
                                height={20}
                                width={20}
                                alt='image'
                                className=''
                            />
                        </div>
                        <p className=''>processing</p>
                    </div>
                    ):
                    'submit'
                }
            </Button>
        </form>
    </Form>
  )
}

export default UserForm