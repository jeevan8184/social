"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignInSchema } from '@/lib/validations'
import { SignInValues } from '@/consants'
import { useRouter } from 'next/navigation'
import { SignIn } from '@/lib/actions/Auth.actions'
import Image from 'next/image'
import { useToast } from '../ui/use-toast'
import { getUser } from '@/lib/actions/User.actions'

const SignInForm = () => {

    const router=useRouter();
    const [newError, setNewError] = useState('');
    const [IsShowPass, setIsShowPass] = useState(false);

    const {toast}=useToast();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: SignInValues
      })
     
      async function onSubmit(values: z.infer<typeof SignInSchema>) {
        try {
            const AuthData=await SignIn({
                email:values.email,
                password:values.password,
            })
            if(AuthData.error) {
                return setNewError(AuthData.error);
            }
            const user=await getUser();
            if(user) {
                router.push('/');
            }else{
                router.push('/onBoard');
            }
        } catch (error) {
            console.log(error);
            setNewError('some error occured');
        }
      }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=' flex flex-col gap-4'>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem className=' flex flex-col gap-1 items-start'>
                    <FormLabel className='ml-2'>Email</FormLabel>
                        <FormControl>
                            <Input autoFocus placeholder="email" {...field} className='input dark:bg-dark-4 focus-visible:ring-0  ' />
                        </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem className=' flex flex-col gap-1'>
                    <FormLabel className='ml-2'>password</FormLabel>
                        <FormControl>
                            <div className=' px-4 rounded-full  bg-gray-50 dark:bg-dark-4 flex-between'>
                                <Input 
                                    placeholder="password" 
                                    {...field} 
                                    className='focus-visible:ring-0 dark:bg-dark-4 rounded-full focus-visible:ring-offset-0 border-none bg-gray-50' 
                                    type={IsShowPass ? 'text':'password'}
                                />
                                <button 
                                    type='button'
                                    className=' flex-end'
                                    onClick={()=> setIsShowPass((prev)=> !prev)}
                                >
                                    {IsShowPass ? 'hide':'show'}
                                </button>
                            </div>
                        </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <p className=' text-sm text-red-500 flex-center my-1 '>{newError}</p>
            <div className=' flex justify-between'>
                <p className=' text-sm'>Dont have an Account ? 
                    <strong 
                        className=' text-primary-500 cursor-pointer '
                        onClick={()=> router.push('/sign-up') }
                    >
                        Sign Up
                    </strong>
                </p>
                <Button 
                    type='submit'
                    className=' rounded-full px-6 py-2'
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
            </div>
        </form>
    </Form>
  )
}

export default SignInForm;