
import mongoose, { Schema, model, models } from "mongoose";

const AuthSchema=new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String,required:true,unique:true}

})

const Auth=models.Auth || model('Auth',AuthSchema);

export default Auth;