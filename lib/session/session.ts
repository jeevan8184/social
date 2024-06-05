
import 'server-only';
import {SignJWT,jwtVerify} from 'jose'
import { SessionParams } from '../types';

const secretkey=process.env.SESSION_SECRET;
const encodedKey=new TextEncoder().encode(secretkey);

export async function encrypt(payload:SessionParams) {
    return new SignJWT(payload)
        .setProtectedHeader({alg:'HS256'})
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(encodedKey)
}

export async function decrypt(session:string | undefined='') {
    try {
        const {payload}=await jwtVerify(session,encodedKey,{
            algorithms:['HS256'],
        })
        return payload;
    } catch (error) {
        console.log(error);
    }   
}