"use server"

import { connectToDB } from "../database";
import Auth from "../database/models/Auth.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignInProps, SignUpProps } from "../types";
import { encrypt } from "../session/session";
import { cookies } from "next/headers";
import { deleteSession } from "../session";
import { revalidatePath } from "next/cache";

export const SignIn=async({email,password}:SignInProps)=> {

    try {
        await connectToDB();

        const existUser=await Auth.findOne({email});
        if(!existUser) {
            return {error:'User does not exists exists please signup'};
        }
        
        const isPass=await bcrypt.compare(password,existUser.password);
        console.log('isPass',isPass);
        if(!isPass) {
            return {error:'password is incorrect '}
        }

        const secret=process.env.SECRET!
        const token=jwt.sign({email:existUser.email,password:existUser.password},secret,{expiresIn:'1d'});

        const id=JSON.parse(JSON.stringify(existUser._id));
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const session=await encrypt({authId:id,token,expiresAt})

        cookies().set('session',session,{
            httpOnly:true,
            secure:true,
            expires:expiresAt,
        })

        return JSON.parse(JSON.stringify({
            data:existUser,token
        }))

    } catch (error) {
        console.log(error);
    }
}

export const SignUp=async({email,username,password,confirmPassword}:SignUpProps)=> {

    try {
        await connectToDB();
        const existUser=await Auth.findOne({email});
        if(existUser) return {error:'User already exists pls signin'}
        
        if(password !== confirmPassword) return {error:'password does not match.'};

        const newPassword=await bcrypt.hash(password,12);

        const newAuth=await Auth.create({
            email,username,password:newPassword
        })
        const secret=process.env.SECRET!

        const token=jwt.sign({email:newAuth.email,password:newAuth.password},secret,{expiresIn:'1d'});

        const id=JSON.parse(JSON.stringify(newAuth._id));
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const session=await encrypt({authId:id,token,expiresAt})

        cookies().set('session',session,{
            httpOnly:true,
            secure:true,
            expires:expiresAt,
        })

        return JSON.parse(JSON.stringify({
            data:newAuth,token
        }))

    } catch (error) {
        console.log(error);
    }
}

export const Logout=()=> {
    deleteSession();
}
