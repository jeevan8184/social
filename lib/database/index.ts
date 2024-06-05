"use server"

import mongoose from 'mongoose';

let cahced=(global as any).mongoose || {conn:null,promise:null};
let url=process.env.MONGODB_URL;

export const connectToDB=async()=> {

    if(!url) throw new Error('pls provide mongodb url');

    try {
        if(cahced.conn) return cahced.conn;

        cahced.promise=cahced.promise || mongoose.connect(url,{dbName:"social"});

        cahced.conn=await cahced.promise;

        return cahced.conn;
        
    } catch (error) {
        console.log(error);
    }
}