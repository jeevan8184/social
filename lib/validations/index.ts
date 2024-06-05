
import * as z from 'zod';

export const SignUpSchema=z.object({
    email:z.string().email(),
    username:z.string().min(3,{message:'username must be 3 chars'}),
    password:z.string().min(4,{message:'password must be 4 chars'}),
    confirmPassword:z.string()
})

export const SignInSchema=z.object({
    email:z.string().email(),
    password:z.string(),
})

export const UserSchema=z.object({
    username:z.string().min(3,{message:'username must be 3 chars'}),
    bio:z.string().min(3,{message:'add some data about yourself'}),
    photo:z.string()
})
