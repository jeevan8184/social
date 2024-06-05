
import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession=cache(async()=> {

    const cookie=cookies().get('session')?.value;
    const session=await decrypt(cookie);

    if(!session?.authId) redirect('/sign-in');

    return {isAuth:true,authId:session?.authId};

})

export const deleteSession=cache(()=> {
    cookies().delete('session');
})
